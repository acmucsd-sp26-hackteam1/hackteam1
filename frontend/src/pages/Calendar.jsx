import { TimeFrames, formatAgendaDate, startOfDay } from "../helpers.js"
import { useState } from 'react';
import { MonthView } from "../components/calendar/MonthView.jsx";
import { WeekView } from "../components/calendar/WeekView.jsx";
import { DayView } from "../components/calendar/DayView.jsx";
import { CalendarLayout } from "../components/calendar/CalendarLayout.jsx";
import { AgendaPanel } from "../components/calendar/AgendaPanel.jsx";
import { GroupChat } from "../components/calendar/GroupChat.jsx";
import { NotesPanel } from "../components/calendar/NotesPanel.jsx";
import ProfileModal from '../components/ProfileModal.jsx';
import { GROUP_MODAL_TABS, useGroupModal } from '../context/GroupModalContext.jsx';
import { SAMPLE_EVENTS, SAMPLE_GROUP, SAMPLE_MESSAGES, SAMPLE_NOTES, SAMPLE_TASKS } from '../data/sampleCalendar.js';

function Calendar() {
  const [viewMode, setViewMode] = useState(TimeFrames.MONTH);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { openGroupModal } = useGroupModal();

  const today = startOfDay(new Date());

  const taskItems = SAMPLE_TASKS
    .filter(task => task.date >= today)
    .slice(0, 3)
    .map(task => ({
      id: task.id,
      date: task.date,
      title: `${task.title} · ${task.time}`,
      detail: formatAgendaDate(task.date),
    }));

  const eventItems = SAMPLE_EVENTS
    .filter(event => event.category === 'event' && event.date >= today)
    .slice(0, 3)
    .map(event => ({
      id: event.id,
      date: event.date,
      title: `${event.title} · ${event.start}`,
      detail: `${event.location} · ${event.note}`,
    }));

  const viewButtonClass = (mode) => (viewMode === mode ? 'active' : '');

  return (
    <>
      <section className="calendar-header">
        <h1 className="calendar-header-title">UCSDTime</h1>
        <p className="calendar-header-subtitle">Calendar</p>
        <p className="calendar-header-blurb">
          Plan your week, share with friends, and stay on top of campus events.
        </p>
      </section>

      <section className="content-container calendar-page">
        <div className="calendar-sidebar">
          <h2>Your Calendar</h2>
          <AgendaPanel title="Upcoming Tasks" subtitle="Coming up next." emptyText="No tasks coming up." items={taskItems} />
          <AgendaPanel title="Upcoming Events" subtitle="Coming up next." emptyText="No events coming up." items={eventItems} />
        </div>

        <div className="calendar-panel">
          <div className="view-buttons">
            <div className="view-buttons-group">
              <button className={viewButtonClass(TimeFrames.DAY)} onClick={() => {setViewMode(TimeFrames.DAY)}}>Day</button>
              <button className={viewButtonClass(TimeFrames.WEEK)} onClick={() => {setViewMode(TimeFrames.WEEK)}}>Week</button>
              <button className={viewButtonClass(TimeFrames.MONTH)} onClick={() => {setViewMode(TimeFrames.MONTH)}}>Month</button>
            </div>
            <div className="view-buttons-group">
              <button type="button" onClick={() => setIsProfileOpen(true)}>
                Profile
              </button>
              <span className="group-name">{SAMPLE_GROUP.name}</span>
              <button type="button" onClick={() => openGroupModal(GROUP_MODAL_TABS.JOIN)}>
                Group Settings
              </button>
            </div>
          </div>
          <CalendarLayout showAvatarSidebar groupCode={SAMPLE_GROUP.code}>
            {viewMode === TimeFrames.MONTH && <MonthView events={SAMPLE_EVENTS} />}
            {viewMode === TimeFrames.WEEK && <WeekView events={SAMPLE_EVENTS} />}
            {viewMode === TimeFrames.DAY && <DayView events={SAMPLE_EVENTS} />}
          </CalendarLayout>
        </div>
      </section>

      <section className="group-band">
        <GroupChat initialMessages={SAMPLE_MESSAGES} onlineCount={3} />
        <NotesPanel notes={SAMPLE_NOTES} />
      </section>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}

export default Calendar