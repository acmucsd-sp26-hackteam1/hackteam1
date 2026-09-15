import { AvatarSidebar } from "./AvatarSidebar";

export function CalendarLayout({ children, showAvatarSidebar }) {
    return (
        <>
            <div className="calendar-layout">
                <div className="calendar-content">
                    {children}
                </div>
                {showAvatarSidebar && <AvatarSidebar />}
            </div>
        </>
    );
}