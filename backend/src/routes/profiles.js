const express = require("express");
const store = require("../store");

const router = express.Router();

function statusFor(error) {
    switch (error.code) {
        case "INVALID_NAME":
        case "INVALID_USERNAME":
        case "AVATAR_TOO_LARGE":
            return 400;
        case "USERNAME_TAKEN":
            return 409;
        case "NOT_FOUND":
            return 404;
        default:
            return 500;
    }
}

router.get("/firebase/:firebaseUid", async (req, res) => {
    try {
        const user = await store.findUserByFirebaseUid(req.params.firebaseUid);
        if (!user) {
            return res.status(404).json({ error: "Profile not found." });
        }
        return res.json(store.serializeUser(user));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not load profile." });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await store.findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "Profile not found." });
        }
        return res.json(store.serializeUser(user));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Could not load profile." });
    }
});

router.put("/", async (req, res) => {
    try {
        const profile = await store.saveProfile(req.body || {});
        return res.json(profile);
    } catch (error) {
        console.error(error);
        return res.status(statusFor(error)).json({ error: error.message });
    }
});

module.exports = router;
