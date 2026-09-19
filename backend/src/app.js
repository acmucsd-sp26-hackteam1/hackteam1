const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const groupRoutes = require("./routes/groupRoutes");
app.use("/api/groups", groupRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

module.exports = app;