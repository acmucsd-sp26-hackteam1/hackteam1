import {
  Months,
  Weekday,
  getMonthName,
  getDayName
} from "../../helpers.js";

import { useState } from "react";
import { MonthDayCell } from "./MonthDayCell.jsx";

export function MonthView({ calendars, currentUserUid, onDeleteEvent }) {
  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [month, setMonth] = useState(
    new Date().getMonth()
  );

  function addMonth(toAdd) {
    let years = Math.floor((toAdd + month) / 12);

    setYear((y) => y + years);

    setMonth((m) => {
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

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  return (
    <>
      <div className="month-container">
        <div onClick={() => addMonth(-1)}>
          go back a month
        </div>

        <div className="month-name">
          {getMonthName(month) + " " + year}
        </div>

        <div onClick={() => addMonth(1)}>
          go forward a month
        </div>
      </div>

      <div className="month-grid">
        {Object.values(Weekday).map((d) => (
          <div key={d} className="month-header">
            {getDayName(d).slice(0, 3)}
          </div>
        ))}

        {Array(firstDayOfMonth).fill(null).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="month-cell"
          />
        ))}

        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;

          const date = new Date(year, month, day);

          return (
            <div key={day} className="month-cell">
              <MonthDayCell
                date={date}
                calendars={calendars}
                currentUserUid={currentUserUid}
                onDeleteEvent={onDeleteEvent}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}