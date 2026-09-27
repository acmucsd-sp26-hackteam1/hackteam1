const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        joinCode: { type: String, required: true, unique: true, index: true },
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        invitedFriendIds: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);