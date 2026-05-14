import { TimeFrames } from "../helpers.js"
import { useState, useRef, useEffect } from 'react';
import { MonthView } from "../components/calendar/MonthView.jsx";

function CalendarTest() {

  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);

  return (
    <section className="content-container">
      <div className="view-buttons"> {/* We should replace with dropdown */}
        <button onClick={() => {setViewMode(TimeFrames.MONTH)}}>Month View</button>
        <button onClick={() => {setViewMode(TimeFrames.WEEK)}}>Week View</button>
        <button onClick={() => {setViewMode(TimeFrames.DAY)}}>Day View</button>
      </div>
      <div className="calendar-content">
        {viewMode === TimeFrames.MONTH && 
        <>month
          <MonthView />
        </>
        }
        {viewMode === TimeFrames.WEEK && 
        <>week</>
        }
        {viewMode === TimeFrames.DAY && 
        <>day</>
        }

      </div>
    </section>
  )
}

export default CalendarTest
