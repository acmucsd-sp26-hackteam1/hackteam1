const mongoose = require("mongoose");
const { Schema } = mongoose;

const generateGroupCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const groupSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    members: [{ type: String }], // plain user IDs/names for now, no User model yet
}, { timestamps: true });

groupSchema.statics.generateUniqueCode = async function () {
    let code;
    let exists = true;
    while (exists) {
        code = generateGroupCode();
        exists = await this.findOne({ code });
    }
    return code;
};

module.exports = mongoose.model("Group", groupSchema);