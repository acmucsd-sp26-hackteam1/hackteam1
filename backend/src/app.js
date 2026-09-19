const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const groupRoutes = require("./routes/groupRoutes");
app.use("/api/groups", groupRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

module.exports = app;