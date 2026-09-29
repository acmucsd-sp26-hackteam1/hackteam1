const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.post("/", groupController.createGroup);
router.post("/:code/join", groupController.joinGroup);
router.post("/:code/leave", groupController.leaveGroup);
router.get("/:code", groupController.getGroup);

module.exports = router;