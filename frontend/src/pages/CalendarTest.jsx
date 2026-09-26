import { TimeFrames } from'../helpers.js';
import { useState } from 'react';
import { MonthView } from '../components/calendar/MonthView.jsx';
import { WeekView } from '../components/calendar/WeekView.jsx';
import { DayView } from '../components/calendar/DayView.jsx';
import { CalendarLayout } from '../components/calendar/CalendarLayout.jsx';
import ProfileModal from '../components/ProfileModal.jsx';
import AddEventModal from '../components/AddEventModal.jsx';

function CalendarTest() {
  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const [calendars, setCalendars] = useState([
    {
      id: "me",
      name: "My Calendar",
      owner: "Me",
      color: "#4285f4",
      entries: [
        {
          id: "1",
          name: "CSE 100",
          days: ["Monday", "Wednesday", "Friday"],
          startTime: "10:00",
          endTime: "10:50",
          location: "CENTR 101",
        },
      ],
    },


    {
      id: "friend",
      name: "Friend",
      owner: "Friend",
      color: "#ffa928",
      entries: [
        {
          id: "2",
          name: "CSE 100",
          days: ["Tuesday", "Thursday"],
          startTime: "14:00",
          endTime: "15:20",
          location: "WLH 2005",
        },

        {
          id: "3",
          name: "CSE 110",
          days: ["Monday", "Wednesday", "Friday"],
          startTime: "14:00",
          endTime: "15:20",
          location: "WLH 2005",
        },
      ],
    },


    {
      id: "friend2",
      name: "Friend 2",
      owner: "Friend 2",
      color: "#ff2828",
      entries: [
        {
          id: "3",
          name: "MUS 15",
          days: ["Tuesday"],
          startTime: "14:00",
          endTime: "15:20",
          location: "WLH 2005",
        },

        {
          id: "4",
          name: "CSE 110",
          days: ["Monday", "Wednesday", "Friday"],
          startTime: "14:00",
          endTime: "15:20",
          location: "WLH 2005",
        },

        {
          id: "5",
          name: "Meet up with friends",
          days: ["Saturday"],
          startTime: "13:00",
          endTime: "16:50",
          location: "UTC",
        },
      ],
    },
  ]);

  const [visibleCalendarIds, setVisibleCalendarIds] = useState(
    calendars.map((calendar) => calendar.id)
  );

  function toggleCalendar(calendarId) {
    if (calendarId === "me") {
      return;
    }

    setVisibleCalendarIds((currentIds) => {
      if (currentIds.includes(calendarId)) {
        return currentIds.filter((id) => id !== calendarId);
      }

      return [...currentIds, calendarId];
    });
  }

  const visibleCalendars = calendars.filter((calendar) =>
    visibleCalendarIds.includes(calendar.id)
  );

  function addEvent(newEvent) {
    setCalendars((currentCalendars) =>
      currentCalendars.map((calendar) => {
        if (calendar.id === "me") {
          return {
            ...calendar,
            entries: [
              ...calendar.entries,
              newEvent
            ],
          };
        }
        return calendar;
      })
    );
  }

  return (
    <section className="content-container">
      <div className="view-buttons">
        <p>Modal open: {isAddEventOpen ? "YES" : "NO"}</p>
        <button
          type="button"
          onClick={() => setIsProfileOpen(true)}
        >
          Profile
        </button>

        <button
          onClick={() => setViewMode(TimeFrames.MONTH)}
        >
          Month View
        </button>

        <button
          onClick={() => setViewMode(TimeFrames.WEEK)}
        >
          Week View
        </button>

        <button
          onClick={() => setViewMode(TimeFrames.DAY)}
        >
          Day View
        </button>
        
        <button
          type="button"
          onClick={() => setIsAddEventOpen(true)}
        >
          + Add Event
        </button>
      </div>

      

      <CalendarLayout
        showAvatarSidebar
        calendars={calendars}
        visibleCalendarIds={visibleCalendarIds}
        onToggleCalendar={toggleCalendar}
      >
        {viewMode === TimeFrames.MONTH && (
          <MonthView calendars={visibleCalendars} />
        )}

        {viewMode === TimeFrames.WEEK && (
          <WeekView calendars={visibleCalendars} />
        )}

        {viewMode === TimeFrames.DAY && (
          <DayView calendars={visibleCalendars} />
        )}
      </CalendarLayout>

      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAddEvent={addEvent}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </section>
  );
}

export default CalendarTest;