const express = require("express");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const docRouter = require("./routes/document.routes");
const verifyRouter = require("./routes/verify.routes");

const app = express();

app.use(express.json());

// cookie parsing
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/document", docRouter);
app.use("/api/document", verifyRouter);

module.exports = app;
