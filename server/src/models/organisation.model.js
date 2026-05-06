const mongoose = require("mongoose");

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Organisation name is required."],
      trim: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Organisation = mongoose.model("Organisation", organisationSchema);

module.exports = Organisation;
