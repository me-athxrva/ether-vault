const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const docRouter = require("./routes/document.routes");
const verifyRouter = require("./routes/verify.routes");

const app = express();

app.use(express.json());

// cookie parsing
app.use(cookieParser());

const allowedOrigins = [process.env.FRONTEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// routes
app.use("/api/auth", authRouter);
app.use("/api/document", docRouter);
app.use("/api/document", verifyRouter);

module.exports = app;
