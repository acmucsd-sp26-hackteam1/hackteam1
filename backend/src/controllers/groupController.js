const Group = require("../models/group");

exports.createGroup = async (req, res) => {
    try {
        const { name, userId, friendIds = [] } = req.body;
        if (!name || !userId) return res.status(400).json({ error: "name and userId required" });
        if (!Array.isArray(friendIds)) {
            return res.status(400).json({ error: "friendIds must be an array" });
        }

        const members = [...new Set([
            userId,
            ...friendIds.filter((id) => typeof id === "string").map((id) => id.trim()).filter(Boolean),
        ])];

        const code = await Group.generateUniqueCode();
        const group = await Group.create({ name, code, members });

        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.joinGroup = async (req, res) => {
    try {
        const { code } = req.params;
        const { userId } = req.body;

        const group = await Group.findOne({ code });
        if (!group) return res.status(404).json({ error: "Group not found" });

        if (!group.members.includes(userId)) {
            group.members.push(userId);
            await group.save();
        }

        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGroup = async (req, res) => {
    try {
        const { code } = req.params;
        const group = await Group.findOne({ code });
        if (!group) return res.status(404).json({ error: "Group not found" });

        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

