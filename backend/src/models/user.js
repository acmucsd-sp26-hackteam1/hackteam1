const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID
    friendId: { type: String, unique: true, sparse: true },
    displayName: { type: String },
    email: { type: String },
    avatar: { type: String }, // Firebase photoURL, or later a custom uploaded one
    username: { type: String, trim: true },
    aboutMe: { type: String, trim: true },
    friendId: { type: String, unique: true, sparse: true },
    username: { type: String, trim: true },
    aboutMe: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);