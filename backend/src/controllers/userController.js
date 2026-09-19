const User = require("../models/user");

exports.upsertUser = async (req, res) => {
    try {
        const { uid, displayName, email, avatar } = req.body;
        if (!uid) return res.status(400).json({ error: "uid required" });

        const user = await User.findOneAndUpdate(
            { uid },
            { uid, displayName, email, avatar },
            { upsert: true, new: true }
        );

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};