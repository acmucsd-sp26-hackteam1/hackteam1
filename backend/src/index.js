require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 3000;

const start = async () => {
    if (process.env.MONGODB_URI) {
        try {
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`MongoDB connected successfully: ${conn.connection.host}`);
        } catch (error) {
            console.error(`Database connection error: ${error.message}`);
            console.warn("Falling back to in-memory store for local development.");
        }
    } else {
        console.warn("No MONGODB_URI set; using in-memory store. Profiles and groups reset when the server restarts.");
    }

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
};

start();
