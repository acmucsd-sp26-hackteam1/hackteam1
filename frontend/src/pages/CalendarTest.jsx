import { TimeFrames } from "../helpers.js"
import { useState } from 'react';
import { MonthView } from "../components/calendar/MonthView.jsx";
import { WeekView } from "../components/calendar/WeekView.jsx";
import { DayView } from "../components/calendar/DayView.jsx";
import ProfileModal from '../components/ProfileModal.jsx';
import { CalendarLayout } from "../components/calendar/CalendarLayout.jsx";

function CalendarTest() {
  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <section className="content-container">
      <div className="view-buttons">
        <button type="button" onClick={() => setIsProfileOpen(true)}>
          Profile
        </button>
        <button onClick={() => {setViewMode(TimeFrames.MONTH)}}>Month View</button>
        <button onClick={() => {setViewMode(TimeFrames.WEEK)}}>Week View</button>
        <button onClick={() => {setViewMode(TimeFrames.DAY)}}>Day View</button>
      </div>
      <CalendarLayout showAvatarSidebar={true}>
        {viewMode === TimeFrames.MONTH && <MonthView />}
        {viewMode === TimeFrames.WEEK && <WeekView />}
        {viewMode === TimeFrames.DAY && <DayView />}
      </CalendarLayout>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </section>
  )
}

export default CalendarTest