import { TimeFrames } from "../helpers.js";
import { useEffect, useState } from "react";
import { MonthView } from "../components/calendar/MonthView.jsx";
import { WeekView } from "../components/calendar/WeekView.jsx";
import { DayView } from "../components/calendar/DayView.jsx";
import { CalendarLayout } from "../components/calendar/CalendarLayout.jsx";
import ProfileModal from "../components/ProfileModal.jsx";
import AddEventModal from "../components/AddEventModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCurrentGroup } from "../context/CurrentGroupContext.jsx";
import { CourseSearch } from '../components/CourseSearch.jsx'

const CALENDAR_COLORS = [
  "#4285f4",
  "#ffa928",
  "#ff2828",
  "#34a853",
  "#9c27b0",
  "#00acc1",
];

const DAY_MAP = { M: 'Monday', Tu: 'Tuesday', W: 'Wednesday', Th: 'Thursday', F: 'Friday' }

const QUARTER_START = '2026-09-24'

function parseDays(str) {
  return (String(str ?? '').match(/Tu|Th|M|W|F/g) || []).map((d) => DAY_MAP[d])
}

// "9:00a" -> "09:00", "5:50p" -> "17:50", "12:30p" -> "12:30", "12:00a" -> "00:00"
function to24Hour(str) {
  const match = String(str ?? '').trim().match(/^(\d{1,2}):(\d{2})\s*([ap])/i)
  if (!match) return ''
  let hours = parseInt(match[1], 10)
  const minutes = match[2]
  const isPM = match[3].toLowerCase() === 'p'
  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0
  return `${String(hours).padStart(2, '0')}:${minutes}`
}

function Calendar({ onProfileSaved, currentUserAvatar }) {
  const { currentUser } = useAuth();
  const { currentGroupCode, setCurrentGroupCode } = useCurrentGroup();
  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [visibleCalendarIds, setVisibleCalendarIds] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    async function fetchGroups() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/groups/user/${currentUser.uid}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch groups"
          );
        }

        const data = await response.json();
        console.log("User groups:", data);
        setGroups(data);
        setGroupsLoaded(true);
        if (data.length === 0) {
          setSelectedGroup(null);
          setCurrentGroupCode(null);
          return;
        }
        const currentGroup = data.find(
          (group) =>
            group.code === currentGroupCode
        );


        if (currentGroup) {
          setSelectedGroup(currentGroup);
        } else {
          setSelectedGroup(data[0]);
          setCurrentGroupCode(
            data[0].code
          );
        }
      } catch (err) {
        console.error(
          "Error fetching groups:",
          err
        );
      }
    }


    fetchGroups();
  }, [
    currentUser,
    currentGroupCode,
    setCurrentGroupCode,
  ]);

  useEffect(() => {

    if (!currentUser) {
      return;
    }
    const memberUids = selectedGroup ? selectedGroup.members || [] : [currentUser.uid];
    async function fetchGroupCalendars() {

      try {
        console.log(
          "Selected group:",
          selectedGroup
        );
        const response = await fetch(
          "http://localhost:3000/api/events/users",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              uids:
                memberUids,
            }),
          }
        );

        if (!response.ok) {

          throw new Error(
            "Failed to fetch group events"
          );
        }

        const events =
          await response.json();

        const memberNames = await Promise.all(
          memberUids.map(async (uid) => {
            try {
              const userResponse = await fetch(`http://localhost:3000/api/users/${uid}`);
              if (!userResponse.ok) return null;
              const user = await userResponse.json();
              return user.displayName || user.username || null;
            } catch {
              return null;
            }
          })
        );

        console.log(
          "Group events:",
          events
        );

        const groupCalendars =
          memberUids.map(
            (uid, index) => ({

              id: uid,
              ownerUid: uid,

              name:
                uid === currentUser.uid
                  ? "My Calendar"
                  : memberNames[index] || `Member ${index + 1}`,

              owner:
                uid === currentUser.uid
                  ? "Me"
                  : memberNames[index] || `Member ${index + 1}`,

              color:
                CALENDAR_COLORS[
                  index %
                    CALENDAR_COLORS.length
                ],

              entries: events.filter(
                (event) =>
                  event.ownerUid === uid
              ),
            })
          );

        console.log(
          "Built calendars:",
          groupCalendars
        );

        setCalendars(
          groupCalendars
        );

        setVisibleCalendarIds(
          groupCalendars.map(
            (calendar) =>
              calendar.id
          )
        );

      } catch (err) {

        console.error(
          "Error loading group calendars:",
          err
        );
      }
    }

    fetchGroupCalendars();

  }, [
    selectedGroup,
    currentUser,
  ]);

  function toggleCalendar(calendarId) {
    if (calendarId === currentUser?.uid) {
      return;
    }

    setVisibleCalendarIds((currentIds) => {
      if (currentIds.includes(calendarId)) {
        return currentIds.filter(
          (id) => id !== calendarId
        );
      }

      return [
        ...currentIds,
        calendarId,
      ];
    });
  }

  const visibleCalendars =
    calendars.filter(
      (calendar) =>
        visibleCalendarIds.includes(
          calendar.id
        )
    );

  function addEvent(newEvent) {

    if (!currentUser) {
      return;
    }

    setCalendars(
      (currentCalendars) =>

        currentCalendars.map(
          (calendar) => {

            if (
              calendar.id ===
              currentUser.uid
            ) {

              return {
                ...calendar,

                entries: [
                  ...calendar.entries,
                  newEvent,
                ],
              };
            }

            return calendar;
          }
        )
    );
  }

    async function handleAddCourse(course, section) {
    if (!currentUser) return
    const meeting = section ?? course.sections?.find((s) => s.type === 'LE')
    if (!meeting) {
      console.warn('No section found for', course)
      return
    }
    const recurringDays = parseDays(meeting.days)
    if (recurringDays.length === 0) {
      console.warn('Section has no meeting days', meeting)
      return
    }
    const isLecture = meeting.type === 'LE'
    const payload = {
      name: isLecture
        ? `${course.subject} ${course.number}`
        : `${course.subject} ${course.number} ${meeting.type} ${meeting.code}`,
      ownerUid: currentUser.uid,
      startDate: QUARTER_START,
      startTime: to24Hour(meeting.time_start),
      endTime: to24Hour(meeting.time_end),
      isRecurring: true,
      recurringDays,
      location: `${meeting.building} ${meeting.room}`.trim(),
    }
    try {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error('Failed to save section')
      const saved = await response.json()
      addEvent(saved)
    } catch (err) {
      console.error('Error adding section:', err)
    }
  }

  async function deleteEvent(eventId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setCalendars((currentCalendars) =>
        currentCalendars.map((calendar) => ({
          ...calendar,
          entries: calendar.entries.filter(
            (entry) => entry._id !== eventId
          ),
        }))
      );
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  }

  function handleGroupChange(e) {
    const group =
      groups.find(
        (group) => group._id === e.target.value);

    if (group) {
      console.log("Switching group:", group);
      setSelectedGroup(group);
      setCurrentGroupCode(group.code);
    }
  }

  return (
    <>
    <section className="calendar-header">
      <h1 className="calendar-header-title">UCSDTime</h1>
      <p className="calendar-header-subtitle">Calendar</p>
      <p className="calendar-header-blurb">
        Plan your week, share with friends, and stay on top of campus events.
      </p>
    </section>
    <section className="content-container calendar-page">
      <div className="calendar-top-controls">
        <div className="group-selector">
          {groups.length > 0 ? (
            <select
              value={
                selectedGroup?._id ??
                ""
              }
              onChange={
                handleGroupChange
              }
            >

              {groups.map(
                (group) => (
                  <option
                    key={
                      group._id
                    }
                    value={
                      group._id
                    }
                  >
                    {group.name}

                  </option>
                )
              )}

            </select>

          ) : (

            <span className="no-group-label">
              No Group
            </span>

          )}

        </div>

        <CourseSearch onAddCourse={handleAddCourse} />

        <div className="view-buttons">

          <button
            type="button"
            onClick={() =>
              setIsProfileOpen(true)
            }
          >
            Profile
          </button>


          <button
            type="button"
            className={viewMode === TimeFrames.MONTH ? "active" : ""}
            onClick={() =>
              setViewMode(
                TimeFrames.MONTH
              )
            }
          >
            Month View
          </button>


          <button
            type="button"
            className={viewMode === TimeFrames.WEEK ? "active" : ""}
            onClick={() =>
              setViewMode(
                TimeFrames.WEEK
              )
            }
          >
            Week View
          </button>


          <button
            type="button"
            className={viewMode === TimeFrames.DAY ? "active" : ""}
            onClick={() =>
              setViewMode(
                TimeFrames.DAY
              )
            }
          >
            Day View
          </button>


          <button
            type="button"
            onClick={() =>
              setIsAddEventOpen(
                true
              )
            }
          >
            + Add Event
          </button>

        </div>

      </div>

      {groupsLoaded && groups.length === 0 && (

        <p>
          You are not currently
          in any groups.
        </p>

      )}

      <CalendarLayout

        showAvatarSidebar

        calendars={
          calendars
        }

        visibleCalendarIds={
          visibleCalendarIds
        }

        onToggleCalendar={
          toggleCalendar
        }

        currentUserAvatar={currentUserAvatar}

      >


        {viewMode ===
          TimeFrames.MONTH && (

          <MonthView
            calendars={visibleCalendars}
            currentUserUid={currentUser?.uid}
            onDeleteEvent={deleteEvent}
          />

        )}


        {viewMode === TimeFrames.WEEK && (
          <WeekView
            calendars={visibleCalendars}
            currentUserUid={currentUser?.uid}
            onDeleteEvent={deleteEvent}
          />
        )}


        {viewMode === TimeFrames.DAY && (
          <DayView
            calendars={visibleCalendars}
            currentUserUid={currentUser?.uid}
            onDeleteEvent={deleteEvent}
          />
        )}


      </CalendarLayout>

      <AddEventModal

        isOpen={
          isAddEventOpen
        }

        onClose={() =>
          setIsAddEventOpen(
            false
          )
        }

        onAddEvent={
          addEvent
        }

      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onProfileSaved={onProfileSaved}
      />
    </section>
    </>
  );
}


export default Calendar;