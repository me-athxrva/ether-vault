const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required for creating an account."],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email address."],
      unique: [true, "Email already exists."],
    },
    name: {
      type: String,
      required: [true, "Name is required for creating an account."],
    },
    password: {
      type: String,
      required: [true, "Password is required for creating an account."],
      minlength: [8, "Password should contain more than 8 characters."],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hash = await bcrypt.hash(this.password, 8);
  this.password = hash;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
