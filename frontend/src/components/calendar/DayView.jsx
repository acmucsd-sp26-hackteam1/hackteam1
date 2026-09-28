import { useState } from "react";

export function DayView({
  calendars,
  currentUserUid,
  onDeleteEvent
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  function changeDay(amount) {
    setSelectedDate((current) => {
      const newDate = new Date(current);
      newDate.setDate(newDate.getDate() + amount);
      return newDate;
    });
  }

  function shouldShowEvent(entry) {
    if (!entry.startDate) {
      return false;
    }

    const eventDate = new Date(entry.startDate);

    if (entry.isRecurring) {
      const dayName = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      return (
        selectedDate >= eventDate &&
        (entry.recurringDays ?? []).includes(dayName)
      );
    }

    return (
      eventDate.getFullYear() === selectedDate.getFullYear() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getDate() === selectedDate.getDate()
    );
  }

  const dayName = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="day-view">
      <div className="day-navigation">
        <button
          type="button"
          onClick={() => changeDay(-1)}
        >
          Previous Day
        </button>

        <div>
          <h2>{dayName}</h2>
          <p>{formattedDate}</p>
        </div>

        <button
          type="button"
          onClick={() => changeDay(1)}
        >
          Next Day
        </button>
      </div>

      {calendars.map((calendar) =>
        calendar.entries
          .filter((entry) => shouldShowEvent(entry))
          .map((entry) => (
            <div
              key={`${calendar.id}-${entry._id ?? entry.id}`}
              className="day-event"
              style={{
                backgroundColor: calendar.color,
              }}
            >
              <strong>{entry.name}</strong>

              <p>
                {entry.startTime} - {entry.endTime}
              </p>

              {entry.location && (
                <p>{entry.location}</p>
              )}

              <p>{calendar.owner}</p>

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
}