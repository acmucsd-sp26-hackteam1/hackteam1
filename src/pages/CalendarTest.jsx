import { TimeFrames } from "../helpers.js"
import { useState } from 'react';
import { MonthView } from "../components/calendar/MonthView.jsx";
import { WeekView } from "../components/calendar/WeekView.jsx";
import { DayView } from "../components/calendar/DayView.jsx";
import { Link } from 'react-router-dom';

function CalendarTest() {

  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);

  return (
    <section className="content-container">
      <div>
        <Link to="/join-team"><button>Join Team</button></Link>
        <Link to="/create-team"><button>Create Team</button></Link>
      </div>
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
