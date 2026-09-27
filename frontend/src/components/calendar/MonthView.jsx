import { Weekday, getMonthName, getDayName, getMonthGridDays, getEventsOnDay } from '../../helpers.js';
import { useState } from 'react';
import { MonthDayCell } from './MonthDayCell.jsx';

export function MonthView({ events }) {
    const [year, setYear] = useState((new Date()).getFullYear());
    const [month, setMonth] = useState((new Date()).getMonth());

    function addMonth(toAdd) {
        let years = Math.floor((toAdd + month)/12);
        setYear(y => y + years);
        setMonth(m => {
            m += toAdd;
            if (m < 0) {
                m %= 12;
                m += 12;
            } else {
                m %= 12;
            }
            return m;
        });
    }

    const mondayFirstWeekdays = [...Object.values(Weekday).slice(1), Weekday.SUNDAY];

    return (
        <>
            <div className="month-container">
                <button type="button" className="round-arrow" onClick={() => addMonth(-1)} aria-label="Go back a month">‹</button>
                <div className="month-name">{getMonthName(month) + ' ' + year}</div>
                <button type="button" className="round-arrow" onClick={() => addMonth(1)} aria-label="Go forward a month">›</button>
            </div>
            <div className="month-grid">
                {mondayFirstWeekdays.map(d => <div key={d} className="month-header">{getDayName(d).slice(0, 3)}</div>)}
                {getMonthGridDays(year, month).map(day => <MonthDayCell key={day.toISOString()} day={day} events={getEventsOnDay(events, day)} />)}
            </div>
        </>
    );
}
