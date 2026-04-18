const userModel = require("../models/user.model");
const redis = require("../config/redis");
const jwt = require("jsonwebtoken");

async function userRegisterController(req, res) {
  const { email, name, password } = req.body || {};

  if (!email || !name || !password) {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!name) missingFields.push("name");
    if (!password) missingFields.push("password");

    return res.status(400).json({
      message: `Missing fields: ${missingFields.join(", ")}`,
      status: "failed",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format",
      status: "failed",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters",
      status: "failed",
    });
  }

  try {
    const user = await userModel.create({
      email,
      password,
      name,
      role: "user",
    });

    return res.status(201).json({
      user: { id: user._id },
      status: "success",
    });
  } catch (err) {
    if (
      err.code === 11000 ||
      err.message.includes("duplicate key") ||
      err.message.includes("already exists")
    ) {
      return res.status(409).json({
        message: "User already exists",
        status: "failed",
      });
    }

    console.log(err);

    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function userLoginController(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    return res.status(400).json({
      message: `Missing fields: ${missingFields.join(", ")}`,
      status: "failed",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password +role");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: "failed",
      });
    }
    
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      user: {
        id: user._id,
      },
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function adminLoginController(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    return res.status(400).json({
      message: `Missing fields: ${missingFields.join(", ")}`,
      status: "failed",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password +role");

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
        status: "failed",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Not an admin.",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password.",
        status: "failed",
      });
    }

    
    const existingCooldown = await redis.get(`otp:${user._id}:cooldown`);
    if (existingCooldown) {
      return res.status(429).json({
        message: "OTP already sent. Try again later.",
        status: "failed",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await redis.set(`otp:${user._id}`, otp, {
      ex: 300,
    });

    await redis.set(`otp:${user._id}:cooldown`, "1", {
      ex: 60,
    });

    console.log(`Admin OTP for ${email}: ${otp}`);

    return res.status(200).json({
      message: `OTP sent to ${user._id}`,
      token: user._id,
      status: "success",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function verifyOtpController(req, res) {
  const { token, otp } = req.body || {};

  if (!token || !otp) {
    const missingFields = [];
    if (!token) missingFields.push("token");
    if (!otp) missingFields.push("otp");

    return res.status(400).json({
      message: `Missing fields: ${missingFields.join(", ")}`,
      status: "failed",
    });
  }

  try {
    const storedOtp = await redis.get(`otp:${token}`);

    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP expired or not found",
        status: "failed",
      });
    }

    if (storedOtp.toString() !== otp.toString()) {
      return res.status(401).json({
        message: "Invalid OTP",
        status: "failed",
      });
    }

    await redis.del(`otp:${token}`);
    await redis.del(`otp:${token}:cooldown`);

    const user = await userModel.findById(token).select("+role");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "failed",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied",
        status: "failed",
      });
    }

    const jwt_token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", jwt_token, {
      httpOnly: true,
      secure: false, //change to true with hosting
      sameSite: "lax", //"none" with hosting i.e. https
    });

    return res.status(200).json({
      message: "Admin login successful",
      user: {
        id: user._id,
      },
      status: "success",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function logoutController(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      message: "Logged out successfully",
      status: "success",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
  adminLoginController,
  verifyOtpController,
  logoutController,
};
