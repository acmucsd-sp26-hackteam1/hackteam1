require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Course = require("../models/course");

const COURSES_DIR = path.join(__dirname, "../data/courses");

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const files = fs.readdirSync(COURSES_DIR).filter((f) => f.endsWith(".json"));
    console.log(`Found ${files.length} course files`);

    let totalInserted = 0;

    for (const file of files) {
        const filePath = path.join(COURSES_DIR, file);
        const courses = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        for (const course of courses) {
            await Course.findOneAndUpdate(
                { subject: course.subject, number: course.number },
                course,
                { upsert: true, new: true }
            );
            totalInserted++;
        }
        console.log(`Imported ${file} (${courses.length} courses)`);
    }

    console.log(`Done. ${totalInserted} courses upserted.`);
    await mongoose.disconnect();
}

run().catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
});