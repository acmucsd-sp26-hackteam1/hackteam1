import user1 from "../../assets/avatars/user1.png";
import user2 from "../../assets/avatars/user2.png";
import user3 from "../../assets/avatars/user3.png";

export function AvatarSidebar({
  calendars,
  visibleCalendarIds,
  onToggleCalendar,
}) {
  const avatarMap = {
    me: user1,
    friend: user2,
    friend2: user3,
  };

  return (
    <div className="avatar-sidebar">
      {calendars.map((calendar) => {
        const isVisible =
          visibleCalendarIds.includes(calendar.id);

        return (
          <div
            key={calendar.id}
            className="avatar-row"
          >
            <button
              className={`avatar-circle ${
                isVisible ? "active" : "inactive"
              }`}
              onClick={() =>
                onToggleCalendar(calendar.id)
              }
              disabled={calendar.id === "me"}
            >
              <img
                src={avatarMap[calendar.id]}
                alt={calendar.owner}
              />
            </button>

            <span>{calendar.owner}</span>
          </div>
        );
      })}
    </div>
  );
}