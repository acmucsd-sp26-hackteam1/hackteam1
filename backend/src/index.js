require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 3000;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected sucessfully: ${conn.connection.host}`);

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
    });

    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();