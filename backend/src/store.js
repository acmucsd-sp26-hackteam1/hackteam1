const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("./models/User");
const Group = require("./models/Group");

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
const JOIN_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const memory = {
    users: [],
    groups: [],
};

function isMongo() {
    return mongoose.connection.readyState === 1;
}

function serializeUser(user) {
    return {
        id: String(user.id || user._id),
        displayName: user.displayName,
        username: user.username,
        aboutMe: user.aboutMe || "",
        avatarDataUrl: user.avatarDataUrl || "",
        friendId: user.friendId,
        firebaseUid: user.firebaseUid || "",
        groupIds: (user.groupIds || []).map((id) => String(id)),
    };
}

function serializeGroup(group) {
    return {
        id: String(group.id || group._id),
        name: group.name,
        joinCode: group.joinCode,
        creatorId: String(group.creatorId),
        memberIds: (group.memberIds || []).map((id) => String(id)),
        invitedFriendIds: group.invitedFriendIds || [],
    };
}

function generateFriendId() {
    return String(Math.floor(10000 + Math.random() * 90000));
}

function generateJoinCode() {
    let code = "";
    for (let i = 0; i < 6; i += 1) {
        code += JOIN_CODE_CHARS[crypto.randomInt(0, JOIN_CODE_CHARS.length)];
    }
    return code;
}

async function friendIdExists(friendId) {
    if (isMongo()) {
        return Boolean(await User.exists({ friendId }));
    }
    return memory.users.some((user) => user.friendId === friendId);
}

async function joinCodeExists(joinCode) {
    if (isMongo()) {
        return Boolean(await Group.exists({ joinCode }));
    }
    return memory.groups.some((group) => group.joinCode === joinCode);
}

async function uniqueFriendId() {
    for (let i = 0; i < 20; i += 1) {
        const friendId = generateFriendId();
        if (!(await friendIdExists(friendId))) return friendId;
    }
    throw new Error("Could not generate a unique friend ID.");
}

async function uniqueJoinCode() {
    for (let i = 0; i < 20; i += 1) {
        const joinCode = generateJoinCode();
        if (!(await joinCodeExists(joinCode))) return joinCode;
    }
    throw new Error("Could not generate a unique group code.");
}

function validateUsername(username) {
    if (!USERNAME_PATTERN.test(username)) {
        const error = new Error("Use 3–20 letters, numbers, or underscores.");
        error.code = "INVALID_USERNAME";
        throw error;
    }
}

async function findUserById(id) {
    if (!id) return null;
    if (isMongo()) {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return User.findById(id);
    }
    return memory.users.find((user) => user.id === id) || null;
}

async function findUserByFirebaseUid(firebaseUid) {
    if (!firebaseUid) return null;
    if (isMongo()) {
        return User.findOne({ firebaseUid });
    }
    return memory.users.find((user) => user.firebaseUid === firebaseUid) || null;
}

async function findUserByUsername(username) {
    const usernameLower = username.toLowerCase();
    if (isMongo()) {
        return User.findOne({ usernameLower });
    }
    return memory.users.find((user) => user.usernameLower === usernameLower) || null;
}

async function findUsersByFriendIds(friendIds) {
    const ids = [...new Set(friendIds)];
    if (isMongo()) {
        return User.find({ friendId: { $in: ids } });
    }
    return memory.users.filter((user) => ids.includes(user.friendId));
}

async function saveProfile({
    id,
    displayName,
    username,
    aboutMe = "",
    avatarDataUrl = "",
    firebaseUid = "",
}) {
    const trimmedName = displayName?.trim();
    const trimmedUsername = username?.trim();

    if (!trimmedName) {
        const error = new Error("Name is required.");
        error.code = "INVALID_NAME";
        throw error;
    }

    validateUsername(trimmedUsername);

    if (avatarDataUrl && avatarDataUrl.length > 1_500_000) {
        const error = new Error("Avatar is too large. Please use a smaller image.");
        error.code = "AVATAR_TOO_LARGE";
        throw error;
    }

    const existingProfile = id ? await findUserById(id) : await findUserByFirebaseUid(firebaseUid);
    const existingUsername = await findUserByUsername(trimmedUsername);
    if (
        existingUsername &&
        String(existingUsername.id || existingUsername._id) !== String(existingProfile?.id || existingProfile?._id)
    ) {
        const error = new Error("That username is already taken.");
        error.code = "USERNAME_TAKEN";
        throw error;
    }

    const payload = {
        displayName: trimmedName,
        username: trimmedUsername,
        usernameLower: trimmedUsername.toLowerCase(),
        aboutMe: aboutMe.trim(),
        avatarDataUrl: avatarDataUrl || "",
        firebaseUid: firebaseUid || "",
    };

    const profileId = id || existingProfile && String(existingProfile.id || existingProfile._id);

    if (profileId) {
        const current = existingProfile || await findUserById(profileId);
        if (!current) {
            const error = new Error("Profile not found.");
            error.code = "NOT_FOUND";
            throw error;
        }

        if (isMongo()) {
            Object.assign(current, payload);
            await current.save();
            return serializeUser(current);
        }

        Object.assign(current, payload);
        return serializeUser(current);
    }

    const friendId = await uniqueFriendId();
    if (isMongo()) {
        const created = await User.create({ ...payload, friendId, groupIds: [] });
        return serializeUser(created);
    }

    const created = {
        id: crypto.randomUUID(),
        ...payload,
        friendId,
        groupIds: [],
    };
    memory.users.push(created);
    return serializeUser(created);
}

async function createGroup({ name, friendIds = [], creatorId }) {
    const trimmedName = name?.trim();
    if (!trimmedName) {
        const error = new Error("Group name is required.");
        error.code = "INVALID_NAME";
        throw error;
    }

    const creator = await findUserById(creatorId);
    if (!creator) {
        const error = new Error("Save a profile before creating a group.");
        error.code = "NO_PROFILE";
        throw error;
    }

    const invitedFriendIds = [...new Set(friendIds.map(String).filter((id) => /^\d+$/.test(id)))];
    const invitedUsers = await findUsersByFriendIds(invitedFriendIds);
    const memberIds = new Set([String(creator.id || creator._id)]);
    invitedUsers.forEach((user) => memberIds.add(String(user.id || user._id)));

    const joinCode = await uniqueJoinCode();
    const groupData = {
        name: trimmedName,
        joinCode,
        creatorId: String(creator.id || creator._id),
        memberIds: [...memberIds],
        invitedFriendIds,
    };

    let group;
    if (isMongo()) {
        group = await Group.create(groupData);
        await User.updateMany(
            { _id: { $in: group.memberIds } },
            { $addToSet: { groupIds: group._id } }
        );
        return serializeGroup(group);
    }

    group = { id: crypto.randomUUID(), ...groupData };
    memory.groups.push(group);
    memory.users.forEach((user) => {
        if (group.memberIds.includes(user.id) && !user.groupIds.includes(group.id)) {
            user.groupIds.push(group.id);
        }
    });
    return serializeGroup(group);
}

async function joinGroup({ joinCode, userId }) {
    const trimmedCode = joinCode?.trim().toUpperCase();
    if (!trimmedCode) {
        const error = new Error("Group code is required.");
        error.code = "INVALID_CODE";
        throw error;
    }

    const user = await findUserById(userId);
    if (!user) {
        const error = new Error("Save a profile before joining a group.");
        error.code = "NO_PROFILE";
        throw error;
    }

    let group;
    if (isMongo()) {
        group = await Group.findOne({ joinCode: trimmedCode });
    } else {
        group = memory.groups.find((item) => item.joinCode === trimmedCode) || null;
    }

    if (!group) {
        const error = new Error("No group found with that code.");
        error.code = "NOT_FOUND";
        throw error;
    }

    const memberId = String(user.id || user._id);
    if (!group.memberIds.map(String).includes(memberId)) {
        group.memberIds.push(memberId);
        if (isMongo()) {
            await group.save();
            await User.findByIdAndUpdate(memberId, { $addToSet: { groupIds: group._id } });
        } else if (!user.groupIds.includes(group.id)) {
            user.groupIds.push(group.id);
        }
    }

    return serializeGroup(group);
}

module.exports = {
    isMongo,
    serializeUser,
    findUserById,
    findUserByFirebaseUid,
    saveProfile,
    createGroup,
    joinGroup,
};
