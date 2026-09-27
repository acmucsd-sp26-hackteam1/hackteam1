import { useState } from 'react';
import { CATEGORY_LABELS, getEventsOnDay, formatEventCount, formatDayTitle, startOfDay, addDays } from '../../helpers.js';
import { CalendarTitleBar } from './CalendarTitleBar.jsx';

export function DayView({ events }) {
  const [selectedDay, setSelectedDay] = useState(startOfDay(new Date()));
  const dayEvents = getEventsOnDay(events, selectedDay);

  return (
    <>
      <CalendarTitleBar
        title={formatDayTitle(selectedDay)}
        subtitle={`${formatEventCount(dayEvents.length)} scheduled`}
        onPrevious={() => setSelectedDay(addDays(selectedDay, -1))}
        onNext={() => setSelectedDay(addDays(selectedDay, 1))}
      />
      <div className="day-view">
        {dayEvents.length === 0 && <p className="day-view-empty">Nothing scheduled for this day.</p>}
        {dayEvents.map(event => {
          const [time, period] = event.start.split(' ');
          return (
            <div key={event.id} className={`day-row category-${event.category}`}>
              <div className="day-row-time">
                <span className="day-row-hour">{time}</span>
                <span>{period}</span>
              </div>
              <div className="day-row-details">
                <div className="day-row-header">
                  <p className="day-row-title">{event.title}</p>
                  <span className="badge">{CATEGORY_LABELS[event.category]}</span>
                </div>
                <p className="day-row-when">{event.start} - {event.end} · {event.location}</p>
                <p>{event.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
