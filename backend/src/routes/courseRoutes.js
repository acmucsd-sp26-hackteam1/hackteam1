const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.get("/", courseController.getCourses);
router.get("/:subject/:number", courseController.getCourseByCode);

module.exports = router;