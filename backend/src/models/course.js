const mongoose = require("mongoose");
const { Schema } = mongoose;

const sectionSchema = new Schema({
    section_id: String,
    group: String,
    type: String, // "LE" (lecture), "DI" (discussion), "FI" (final), etc.
    code: String,
    days: String,
    time_start: String,
    time_end: String,
    building: String,
    room: String,
    instructor: String,
    avail: Number,
    limit: Number,
    waitlist: Number,
    enrollable: Number,
    cancelled: Boolean,
    note: String,
}, { _id: false });

const courseSchema = new Schema({
    subject: { type: String, required: true },
    number: { type: String, required: true },
    title: String,
    units: String,
    restriction: String,
    sections: [sectionSchema],
}, { timestamps: true });

courseSchema.index({ subject: 1, number: 1 }, { unique: true });

module.exports = mongoose.model("Course", courseSchema);