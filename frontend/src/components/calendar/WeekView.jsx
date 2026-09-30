import { useState } from "react";

export function WeekView({
  calendars,
  currentUserUid,
  onDeleteEvent
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  function getStartOfWeek(date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return start;
  }

  function changeWeek(amount) {
    setCurrentDate((current) => {
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() + amount * 7);
      return newDate;
    });
  }

  function shouldShowEvent(entry, date) {
    if (!entry.startDate) {
      return false;
    }

    const storedDate = new Date(entry.startDate);
    const eventDate = new Date(storedDate.getUTCFullYear(), storedDate.getUTCMonth(), storedDate.getUTCDate());

    if (entry.isRecurring) {
      const dayName = date.toLocaleDateString("en-US", {
        weekday: "long",
      });

      return (
        date >= eventDate &&
        (entry.recurringDays ?? []).includes(dayName)
      );
    }

    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  }

  const startOfWeek = getStartOfWeek(currentDate);

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });

  const endOfWeek = weekDates[6];

  return (
    <div className="week-view">
      <div className="week-navigation">
        <button
          type="button"
          onClick={() => changeWeek(-1)}
          aria-label="Previous week"
        >
          ‹
        </button>

        <h2>
          {startOfWeek.toLocaleDateString()} -{" "}
          {endOfWeek.toLocaleDateString()}
        </h2>

        <button
          type="button"
          onClick={() => changeWeek(1)}
          aria-label="Next week"
        >
          ›
        </button>
      </div>

      <div className="week-grid">
        {weekDates.map((date) => {
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "long",
          });

          return (
            <div
              key={date.toISOString()}
              className="week-cell"
            >
              <h3>{dayName}</h3>
              <p>{date.toLocaleDateString()}</p>

              {calendars.map((calendar) =>
                calendar.entries
                  .filter((entry) =>
                    shouldShowEvent(entry, date)
                  )
                  .map((entry) => (
                    <div
                      key={`${calendar.id}-${entry._id ?? entry.id}`}
                      className="calendar-entry"
                      style={{
                        backgroundColor: calendar.color,
                      }}
                    >
                      <div className="entry-name">
                        {entry.name}
                      </div>

                      <div className="entry-time">
                        {entry.startTime} - {entry.endTime}
                      </div>

                      {entry.location && (
                        <div className="entry-location">
                          {entry.location}
                        </div>
                      )}

                      <div className="entry-owner">
                        {calendar.owner}
                      </div>

                      {entry.ownerUid === currentUserUid && (
                        <button
                          type="button"
                          onClick={() => onDeleteEvent(entry._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}