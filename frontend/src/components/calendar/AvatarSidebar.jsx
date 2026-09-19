import { useEffect, useState } from "react";
import { useCurrentGroup } from "../../context/CurrentGroupContext.jsx";

export function AvatarSidebar() {
    const { currentGroupCode } = useCurrentGroup();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        if (!currentGroupCode) return;

        async function fetchGroup() {
            try {
                const res = await fetch(`http://localhost:3000/api/groups/${currentGroupCode}`);
                const data = await res.json();
                console.log("Fetched group for sidebar:", data);
                setMembers(data.members || []);
            } catch (err) {
                console.error("Failed to fetch group for sidebar:", err);
            }
        }
        fetchGroup();
    }, [currentGroupCode]);

    if (!currentGroupCode) {
        return <div className="avatar-sidebar"><p>No group yet</p></div>;
    }

    return (
        <div className="avatar-sidebar">
            {members.map((memberId) => (
                <div className="avatar-circle" key={memberId}>
                    <img src="https://dummyimage.com/40x40/cccccc/000000&text=?" alt={memberId} />
                </div>
            ))}
        </div>
    );
}