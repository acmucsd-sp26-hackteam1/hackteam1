import { AvatarSidebar } from "./AvatarSidebar";

export function CalendarLayout({ children, showAvatarSidebar, groupCode }) {
    return (
        <>
            <div className="calendar-layout">
                <div className="calendar-content">
                    {children}
                </div>
                {showAvatarSidebar && <AvatarSidebar groupCode={groupCode} />}
            </div>
        </>
    );
}