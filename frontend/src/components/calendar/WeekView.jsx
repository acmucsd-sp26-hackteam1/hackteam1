import { Weekday, getDayName } from "../../helpers.js";

export function WeekView({ calendars }) {
  return (
    <div className="week-grid">
      {Object.values(Weekday).map((d) => {
        const dayName = getDayName(d);

        return (
          <div key={d} className="week-cell">
            <h3>{dayName}</h3>

            {calendars.map((calendar) =>
              calendar.entries
                .filter((entry) => entry.days.includes(dayName))
                .map((entry) => (
                  <div
                    key={`${calendar.id}-${entry.id}`}
                    className="calendar-entry"
                    style = {{ backgroundColor: calendar.color }}
                  >
                    <div className = "entry-name">
                      {entry.name}
                    </div>

                    <div className = "entry-time">
                      {entry.startTime} - {entry.endTime}
                    </div>

                    <div className = "entry-location">
                      {entry.location}
                    </div>

                    <div className = "entry-owener">
                      {calendar.owner}
                    </div>

                  </div>
                ))
            )}
          </div>
        );
      })}
    </div>
  );
}
