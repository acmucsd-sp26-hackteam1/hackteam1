const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema ({
    name: { type: String, required: true },
    ownerUid: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isRecurring: { type: Boolean, default: false },
    recurringDays: { type: [String], default: [] },
    location: { type: String },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);