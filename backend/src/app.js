const express = require("express");
const cors = require("cors");
const profilesRouter = require("./routes/profiles");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = app;
app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

app.use("/api/profiles", profilesRouter);

module.exports = app;
