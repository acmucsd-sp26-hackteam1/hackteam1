const Course = require("../models/course");

// GET /api/courses
// GET /api/courses?subject=CSE
exports.getCourses = async (req, res) => {
    try {
        const { subject } = req.query;
        const filter = {};
        if (subject) filter.subject = subject.toUpperCase();

        const courses = await Course.find(filter).sort({ subject: 1, number: 1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/courses/:subject/:number
exports.getCourseByCode = async (req, res) => {
    try {
        const { subject, number } = req.params;
        const course = await Course.findOne({
            subject: subject.toUpperCase(),
            number,
        });
        if (!course) return res.status(404).json({ error: "Course not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};