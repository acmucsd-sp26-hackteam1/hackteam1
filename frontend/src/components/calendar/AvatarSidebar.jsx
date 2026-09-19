import { useEffect, useState } from "react";

const TEST_GROUP_CODE = "6MXG3J"; // TODO: replace with dynamic current group code later

export function AvatarSidebar() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        async function fetchGroup() {
            try {
                const res = await fetch(`http://localhost:3000/api/groups/${TEST_GROUP_CODE}`);
                const data = await res.json();
                console.log("Fetched group for sidebar:", data);
                setMembers(data.members || []);
            } catch (err) {
                console.error("Failed to fetch group for sidebar:", err);
            }
        }
        fetchGroup();
    }, []);

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