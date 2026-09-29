const User = require("../models/user");
const mongoose = require("mongoose");

const memoryUsers = new Map();

const FRIEND_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateFriendId() {
    return Array.from({ length: 8 }, () =>
        FRIEND_ID_ALPHABET[Math.floor(Math.random() * FRIEND_ID_ALPHABET.length)]
    ).join("");
}

async function saveUserWithFriendId(userData) {
    if (mongoose.connection.readyState !== 1) {
        const existingUser = memoryUsers.get(userData.uid);
        let friendId = existingUser?.friendId;
        if (!friendId) {
            do {
                friendId = generateFriendId();
            } while ([...memoryUsers.values()].some((user) => user.friendId === friendId));
        }

        const user = { ...existingUser, ...userData, friendId };
        memoryUsers.set(userData.uid, user);
        return user;
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const user = await User.findOne({ uid: userData.uid }) || new User({ uid: userData.uid });
        user.displayName = userData.displayName;
        user.email = userData.email;
        user.avatar = userData.avatar;
        user.username = userData.username;
        user.aboutMe = userData.aboutMe;
        if (!user.friendId) user.friendId = generateFriendId();

        try {
            return await user.save();
        } catch (error) {
            if (error.code !== 11000) throw error;
        }
    }

    throw new Error("Could not assign a unique Friend ID.");
}

exports.upsertUser = async (req, res) => {
    try {
        const { uid, displayName, email, avatar, username = "", aboutMe = "" } = req.body;
        if (!uid) return res.status(400).json({ error: "uid required" });
        if (username && !/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
            return res.status(400).json({ error: "Use 3–20 letters, numbers, or underscores." });
        }

        const user = await saveUserWithFriendId({
            uid,
            displayName,
            email,
            avatar,
            username: username.trim(),
            aboutMe: typeof aboutMe === "string" ? aboutMe.trim() : "",
        });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = mongoose.connection.readyState === 1
            ? await User.findOne({ uid })
            : memoryUsers.get(uid);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};