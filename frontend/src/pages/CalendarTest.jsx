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

const CALENDAR_COLORS = [
  "#4285f4",
  "#ffa928",
  "#ff2828",
  "#34a853",
  "#9c27b0",
  "#00acc1",
];

function CalendarTest({ onProfileSaved }) {
  const { currentUser } = useAuth();
  const { currentGroupCode, setCurrentGroupCode } = useCurrentGroup();
  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [groups, setGroups] = useState([]);
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

    if (!selectedGroup || !currentUser) {
      return;
    }
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
                selectedGroup.members || [],
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

        console.log(
          "Group events:",
          events
        );

        const groupCalendars =
          (selectedGroup.members || []).map(
            (uid, index) => ({

              id: uid,
              ownerUid: uid,

              name:
                uid === currentUser.uid
                  ? "My Calendar"
                  : `Member ${index + 1}`,

              owner:
                uid === currentUser.uid
                  ? "Me"
                  : `Member ${index + 1}`,

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
    <section className="content-container">
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

      {groups.length === 0 && (

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
  );
}


export default CalendarTest;