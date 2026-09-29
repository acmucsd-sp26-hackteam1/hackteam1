export function MonthDayCell({ dayName, calendars }) {
  return (
    <div className="month-day-cell">
      {calendars.map((calendar) =>
        calendar.entries
          .filter((entry) => entry.days.includes(dayName))
          .map((entry) => (
            <div
              key={`${calendar.id}-${entry.id}`}
              className="month-event"
              style={{ backgroundColor: calendar.color }}
            >
              <strong>{entry.name}</strong>

              <div>
                {entry.startTime} - {entry.endTime}
              </div>
            </div>
          ))
      )}
    </div>
  );
}