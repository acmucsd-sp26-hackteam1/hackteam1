import { useEffect, useState } from "react";
import { useCurrentGroup } from "../../context/CurrentGroupContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export function AvatarSidebar({ visibleCalendarIds, onToggleCalendar }) {
    const { currentGroupCode, setCurrentGroupCode, profileVersion } = useCurrentGroup();
    const { currentUser } = useAuth();
    const [memberProfiles, setMemberProfiles] = useState([]);

    useEffect(() => {
        if (!currentGroupCode) return;

        async function fetchGroupAndMembers() {
            try {
                const res = await fetch(`http://localhost:3000/api/groups/${currentGroupCode}`);
                const group = await res.json();

                const profiles = await Promise.all(
                    (group.members || []).map(async (uid) => {
                        try {
                            const userRes = await fetch(`http://localhost:3000/api/users/${uid}`);
                            if (!userRes.ok) return { uid, avatar: null, displayName: uid };
                            const user = await userRes.json();
                            return { uid, avatar: user.avatar, displayName: user.displayName || uid };
                        } catch {
                            return { uid, avatar: null, displayName: uid };
                        }
                    })
                );
                setMemberProfiles(profiles);
            } catch (err) {
                console.error("Failed to fetch group for sidebar:", err);
            }
        }
        fetchGroupAndMembers();
    }, [currentGroupCode, profileVersion]);

    async function handleLeaveGroup() {
        if (!window.confirm("Leave this group?")) return;

        try {
            const res = await fetch(`http://localhost:3000/api/groups/${currentGroupCode}/leave`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: currentUser?.uid }),
            });
            if (!res.ok) throw new Error("Could not leave group.");
            setMemberProfiles([]);
            setCurrentGroupCode(null);
        } catch (err) {
            console.error("Leave group failed:", err);
        }
    }

    if (!currentGroupCode) {
        return <div className="avatar-sidebar"><p>No group yet</p></div>;
    }

    return (
        <div className="avatar-sidebar">
            {memberProfiles.map(({ uid, avatar, displayName }) => {
                const isVisible = visibleCalendarIds?.includes(uid) ?? true;
                return (
                    <div key={uid} className="avatar-row">
                        <button
                            className={`avatar-circle ${isVisible ? "active" : "inactive"}`}
                            onClick={() => onToggleCalendar?.(uid)}
                        >
                            <img
                                src={avatar || "https://dummyimage.com/40x40/cccccc/000000&text=?"}
                                alt={displayName}
                            />
                        </button>
                        <span>{displayName}</span>
                    </div>
                );
            })}
            <button type="button" onClick={handleLeaveGroup}>Leave group</button>
        </div>
    );
}