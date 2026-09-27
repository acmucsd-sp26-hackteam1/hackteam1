import { getCategoriesOnDay } from '../../helpers.js';

export function MonthDayCell({ day, events }) {
    const categories = getCategoriesOnDay(events);
    const mainCategory = categories[0] || 'none';

    return (
        <div className={`month-day-cell category-${mainCategory}`}>
            {categories[1] && <span className={`month-day-cell-right-half category-${categories[1]}`} />}
            <span className="month-day-cell-number">{day.getDate()}</span>
            {events.length === 0 && <span className="month-day-cell-text">No events</span>}
            {events.map(event => <span key={event.id} className="month-day-cell-text">{event.title}</span>)}
        </div>
    )
}