import { AvatarSidebar } from "./AvatarSidebar";

export function CalendarLayout({
  children,
  showAvatarSidebar,
  calendars,
  visibleCalendarIds,
  onToggleCalendar,
  currentUserAvatar,
}) {
  return (
    <div className="calendar-layout">
      <div className="calendar-content">
        {children}
      </div>

      {showAvatarSidebar && (
        <AvatarSidebar
          calendars={calendars}
          visibleCalendarIds={visibleCalendarIds}
          onToggleCalendar={onToggleCalendar}
          currentUserAvatar={currentUserAvatar}
        />
      )}
    </div>
  );
}