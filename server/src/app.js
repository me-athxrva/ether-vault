const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const docRouter = require("./routes/document.routes");
const verifyRouter = require("./routes/verify.routes");
const organisationRouter = require("./routes/organisation.routes");
const dashboardRouter = require("./routes/dashboard.routes");

const app = express();

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://ethervault.atharvadeore.dev",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/document", docRouter);
app.use("/api/document", verifyRouter);
app.use("/api/organisation", organisationRouter);
app.use("/api/dashboard", dashboardRouter);

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File is too large. Max limit is 5MB.",
      status: "failed",
    });
  }

  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({
      message: err.message,
      status: "failed",
    });
  }

  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    status: "failed",
  });
});

module.exports = app;
