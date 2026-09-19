const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    uid: { type: String, required: true, unique: true }, // Firebase UID
    displayName: { type: String },
    email: { type: String },
    avatar: { type: String }, // Firebase photoURL, or later a custom uploaded one
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);