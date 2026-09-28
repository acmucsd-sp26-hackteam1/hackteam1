const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/", eventController.createEvent);
router.get("/:ownerUid", eventController.getEvents);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventcontroller.deleteEvent);

module.exports = router;