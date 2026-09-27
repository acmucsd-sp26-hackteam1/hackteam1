import { useState } from 'react';
import { getDayName, getWeekDays, getEventsOnDay, formatEventCount, formatWeekTitle, startOfWeek, addDays } from '../../helpers.js';
import { CalendarTitleBar } from './CalendarTitleBar.jsx';

export function WeekView({ events }) {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));

  return (
    <>
      <CalendarTitleBar
        title={formatWeekTitle(weekStart)}
        onPrevious={() => setWeekStart(addDays(weekStart, -7))}
        onNext={() => setWeekStart(addDays(weekStart, 7))}
      />
      <div className="week-grid">
        {getWeekDays(weekStart).map(day => {
          const dayEvents = getEventsOnDay(events, day);
          return (
            <div key={day.toISOString()} className="week-cell">
              <div className="week-cell-header">
                <span>{getDayName(day.getDay())} {day.getDate()}</span>
                <span className="badge">{formatEventCount(dayEvents.length)}</span>
              </div>
              {dayEvents.map(event => (
                <div key={event.id} className={`week-event category-${event.category}`}>
                  <p className="week-event-title">{event.title}</p>
                  <p>{event.start} · {event.location}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
