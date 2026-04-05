const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const docRouter = require("./routes/document.routes");

const app = express();

app.use(express.json());

// cookie parsing
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/document", docRouter);
app.use("/uploads", express.static("temp-upload"));

module.exports = app;