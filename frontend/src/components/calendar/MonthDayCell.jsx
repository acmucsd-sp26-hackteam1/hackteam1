export function MonthDayCell({ date, calendars, currentUserUid, onDeleteEvent }) {
  const dayName = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const dayNumber = date.getDate();

  function shouldShowEvent(entry) {
    if (!entry.startDate) {
      return false;
    }

    const eventDate = new Date(entry.startDate);

    // Recurring event
    if (entry.isRecurring) {
      return (
        date >= eventDate &&
        (entry.recurringDays ?? []).includes(dayName)
      );
    }

    // One-time event
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  }

  return (
    <div className="month-day-cell">
      <div className="month-day-number">
        {dayNumber}
      </div>

      {calendars.map((calendar) =>
        calendar.entries
          .filter((entry) => shouldShowEvent(entry))
          .map((entry) => (
            <div
              key={`${calendar.id}-${entry._id ?? entry.id}`}
              className="month-event"
              style={{
                backgroundColor: calendar.color,
              }}
            >
              <strong>{entry.name}</strong>

              <div>
                {entry.startTime} - {entry.endTime}
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
}