import { useEffect, useState } from "react";
import { useCurrentGroup } from "../../context/CurrentGroupContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import defaultPic from "../../assets/d2984ec4b65a8568eab3dc2b640fc58e.jpg";

export function AvatarSidebar({ visibleCalendarIds, onToggleCalendar, currentUserAvatar }) {
    const { currentGroupCode, setCurrentGroupCode } = useCurrentGroup();
    const { currentUser } = useAuth();
    const [memberProfiles, setMemberProfiles] = useState([]);
    const DEFAULT_AVATAR = defaultPic;

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

                            if (!userRes.ok) {
                                return {
                                    uid,
                                    avatar: null,
                                    displayName: uid === currentUser?.uid ? "Me" : "Member"
                                };
                            }

                            const user = await userRes.json();

                            return {
                                uid,
                                avatar: user.avatar,
                                displayName: user.displayName || (uid === currentUser?.uid ? "Me" : "Member")
                            };
                        } catch {
                            return {
                                uid,
                                avatar: null,
                                displayName: uid === currentUser?.uid ? "Me" : "Member"
                            };
                        }
                    })
                );

                setMemberProfiles(profiles);
            } catch (err) {
                console.error("Failed to fetch group for sidebar:", err);
            }
        }

        fetchGroupAndMembers();
    }, [currentGroupCode, currentUser]);

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
        const avatar = currentUserAvatar || DEFAULT_AVATAR;
        const displayName = currentUser?.displayName || currentUser?.email || "You";

        return (
            <div className="avatar-sidebar">
                <div className="avatar-row">
                    <button
                        className="avatar-circle active"
                        type="button"
                    >
                        <img
                            src={avatar}
                            alt={displayName}
                        />
                    </button>
                    <span>{displayName}</span>
                </div>
            </div>
        );
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
                            type="button"
                        >
                            <img
                                src={(uid === currentUser?.uid ? currentUserAvatar : avatar) || DEFAULT_AVATAR}
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