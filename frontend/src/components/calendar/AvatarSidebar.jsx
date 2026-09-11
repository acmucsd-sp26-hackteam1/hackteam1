import user1 from "../../assets/avatars/user1.png";
import user2 from "../../assets/avatars/user2.png";
import user3 from "../../assets/avatars/user3.png";

export function AvatarSidebar() {
    return (
        <div className="avatar-sidebar">
            <div className="avatar-circle">
                <img src={user1} />
            </div>
            <div className="avatar-circle">
                <img src={user2} />
            </div>
            <div className="avatar-circle">
                <img src={user3} />
            </div>
        </div>
    );
}