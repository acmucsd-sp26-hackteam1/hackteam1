import { TimeFrames } from "../helpers.js"
import { useState } from 'react';
import { MonthView } from "../components/calendar/MonthView.jsx";
import { WeekView } from "../components/calendar/WeekView.jsx";
import { DayView } from "../components/calendar/DayView.jsx";

function CalendarTest() {

  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);

  return (
    <section className="content-container">

      {/*I got rid of 'join group' and 'create group' buttons*/}
      {/*However their pages still exist if yall want to use them or get rid of them*/}

      <div className="view-buttons"> {/* We should replace with dropdown */}
        <button onClick={() => {setViewMode(TimeFrames.MONTH)}}>Month View</button>
        <button onClick={() => {setViewMode(TimeFrames.WEEK)}}>Week View</button>
        <button onClick={() => {setViewMode(TimeFrames.DAY)}}>Day View</button>
      </div>
      <div className="calendar-content">
        {viewMode === TimeFrames.MONTH && <MonthView />}
        {viewMode === TimeFrames.WEEK && <WeekView />}
        {viewMode === TimeFrames.DAY && <DayView />}

      </div>
    </section>
  )
}

export default CalendarTest
