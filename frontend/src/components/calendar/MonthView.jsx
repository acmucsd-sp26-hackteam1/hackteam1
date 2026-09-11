import { Months, Weekday, getMonthName, getDayName } from '../../helpers.js';
import { useState } from 'react';

export function MonthView() {
    const [year, setYear] = useState((new Date()).getFullYear());
    const [month, setMonth] = useState(Months.JANUARY);

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

    return (
        <>
            <div className="month-container">
                <div onClick={() => addMonth(-1)}>go back a month</div>
                <div className="month-name">{getMonthName(month) + ' ' + year}</div>
                <div onClick={() => addMonth(1)}>go forward a month</div>
            </div>
            <div className="month-grid">
                {Object.values(Weekday).map(d => <div key={d} className="month-header">{getDayName(d).slice(0, 3)}</div>)}
                {Array(35).fill(null).map((_, i) => <div key={i} className="month-cell"></div>)}
            </div>
        </>
    );
}
