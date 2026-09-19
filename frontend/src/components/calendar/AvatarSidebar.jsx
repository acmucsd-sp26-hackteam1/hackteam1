import { useEffect, useState } from "react";
import { useCurrentGroup } from "../../context/CurrentGroupContext.jsx";

export function AvatarSidebar() {
    const { currentGroupCode } = useCurrentGroup();
    const [memberProfiles, setMemberProfiles] = useState([]);

    useEffect(() => {
        if (!currentGroupCode) return;

        async function fetchGroupAndMembers() {
            try {
                const res = await fetch(`http://localhost:3000/api/groups/${currentGroupCode}`);
                const group = await res.json();
                console.log("Fetched group for sidebar:", group);

                const profiles = await Promise.all(
                    (group.members || []).map(async (uid) => {
                        try {
                            const userRes = await fetch(`http://localhost:3000/api/users/${uid}`);
                            if (!userRes.ok) return { uid, avatar: null };
                            const user = await userRes.json();
                            return { uid, avatar: user.avatar };
                        } catch {
                            return { uid, avatar: null };
                        }
                    })
                );
                setMemberProfiles(profiles);
            } catch (err) {
                console.error("Failed to fetch group for sidebar:", err);
            }
        }
        fetchGroupAndMembers();
    }, [currentGroupCode]);

    if (!currentGroupCode) {
        return <div className="avatar-sidebar"><p>No group yet</p></div>;
    }

    return (
        <div className="avatar-sidebar">
            {memberProfiles.map(({ uid, avatar }) => (
                <div className="avatar-circle" key={uid}>
                    <img
                        src={avatar || "https://dummyimage.com/40x40/cccccc/000000&text=?"}
                        alt={uid}
                    />
                </div>
            ))}
        </div>
    );
}