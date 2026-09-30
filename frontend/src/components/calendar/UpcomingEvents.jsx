const DAYS_TO_LOOK_AHEAD = 14;
const MAX_EVENTS_SHOWN = 5;

function happensOn(entry, date) {
  if (!entry.startDate) {
    return false;
  }

  const storedDate = new Date(entry.startDate);
  const eventDate = new Date(storedDate.getUTCFullYear(), storedDate.getUTCMonth(), storedDate.getUTCDate());

  if (entry.isRecurring) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return date >= eventDate && (entry.recurringDays ?? []).includes(dayName);
  }

  return (
    eventDate.getFullYear() === date.getFullYear() &&
    eventDate.getMonth() === date.getMonth() &&
    eventDate.getDate() === date.getDate()
  );
}

export function UpcomingEvents({ entries }) {
  const today = new Date();
  const upcoming = [];

  for (let offset = 0; offset < DAYS_TO_LOOK_AHEAD; offset++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
    const eventsThatDay = entries
      .filter((entry) => happensOn(entry, date))
      .sort((first, second) => first.startTime.localeCompare(second.startTime));

    for (const entry of eventsThatDay) {
      upcoming.push({ entry, date });
    }
  }

  const shown = upcoming.slice(0, MAX_EVENTS_SHOWN);

  return (
    <div className="upcoming-panel">
      <h3>Upcoming Events</h3>
      <p className="upcoming-subtitle">Your next two weeks.</p>

      {shown.length === 0 && <p className="upcoming-empty">Nothing coming up. Add a course or event!</p>}

      <div className="upcoming-items">
        {shown.map(({ entry, date }) => (
          <div key={`${entry._id ?? entry.id}-${date.toISOString()}`} className="upcoming-item">
            <span className="date-circle">{date.getDate()}</span>
            <div>
              <p className="upcoming-item-title">{entry.name} · {entry.startTime}</p>
              <p className="upcoming-item-detail">
                {date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                {entry.location ? ` · ${entry.location}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
