/*

export function DayView() {
  return (
    <div className="day-view">
      {Array(12).fill(null).map((_, i) => (
        <div key={i} className="day-row"></div>
      ))}
    </div>
  );
}

*/

export function DayView({ calendars }) {
  const selectedDay = "Monday";

  return (
    <div className="day-view">
      <h2>{selectedDay}</h2>

      {calendars.map((calendar) =>
        calendar.entries
          .filter((entry) => entry.days.includes(selectedDay))
          .map((entry) => (
            <div
              key={`${calendar.id}-${entry.id}`}
              className="day-event"
              style={{ backgroundColor: calendar.color }}
            >
              <strong>{entry.name}</strong>

              <p>
                {entry.startTime} - {entry.endTime}
              </p>

              <p>{entry.location}</p>

              <p>{calendar.owner}</p>
            </div>
          ))
      )}
    </div>
  );
}