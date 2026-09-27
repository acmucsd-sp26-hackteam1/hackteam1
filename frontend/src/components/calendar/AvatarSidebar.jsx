import user1 from "../../assets/avatars/user1.png";
import user2 from "../../assets/avatars/user2.png";
import user3 from "../../assets/avatars/user3.png";

export function AvatarSidebar({ groupCode }) {
    return (
        <div className="avatar-sidebar">
            <div className="avatar-circle">
                <img src={user1} />
            </div>
            <p className="avatar-name">You</p>
            <div className="avatar-circle">
                <img src={user2} />
            </div>
            <p className="avatar-name">Sean</p>
            <div className="avatar-circle">
                <img src={user3} />
            </div>
            <p className="avatar-name">Leira</p>
            {groupCode && <p className="group-code">Group ID: {groupCode}</p>}
        </div>
    );
}