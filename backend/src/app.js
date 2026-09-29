const express = require("express");
const cors = require("cors");
const profilesRouter = require("./routes/profiles");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

const groupRoutes = require("./routes/groupRoutes");
app.use("/api/groups", groupRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

app.use("/api/profiles", profilesRouter);

const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);

module.exports = app;