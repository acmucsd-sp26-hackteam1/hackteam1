const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/", eventController.createEvent);
router.post("/users", eventController.getEventsForUsers);
router.get("/:ownerUid", eventController.getEvents);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;