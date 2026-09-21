const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        displayName: { type: String, required: true, trim: true },
        username: { type: String, required: true, trim: true },
        usernameLower: { type: String, required: true, unique: true, index: true },
        aboutMe: { type: String, default: "", trim: true },
        avatarDataUrl: { type: String, default: "" },
        firebaseUid: { type: String, default: "", index: true },
        friendId: { type: String, required: true, unique: true, index: true },
        groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);