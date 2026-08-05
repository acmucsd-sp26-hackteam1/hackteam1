import { TimeFrames } from "../helpers.js"
import { useState } from 'react';
import { MonthView } from "../components/calendar/MonthView.jsx";
import { WeekView } from "../components/calendar/WeekView.jsx";
import { DayView } from "../components/calendar/DayView.jsx";
import { GROUP_MODAL_TABS, useGroupModal } from '../context/GroupModalContext.jsx';

function CalendarTest() {
  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);
  const { openGroupModal } = useGroupModal();
  return (
    <section className="content-container">
      <div className="view-buttons">
        <button type="button" onClick={() => openGroupModal(GROUP_MODAL_TABS.JOIN)}>
          Join Group
        </button>
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