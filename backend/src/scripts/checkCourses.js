require("dotenv").config();
const mongoose = require("mongoose");
const Course = require("../models/course");

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    const count = await Course.countDocuments();
    const sample = await Course.findOne({ subject: "CSE" });
    console.log(`Total courses: ${count}`);
    console.log("Sample CSE course:", sample);
    process.exit(0);
});