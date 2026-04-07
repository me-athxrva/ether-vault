const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required."],
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hash: {
      type: String,
      required: true,
      unique: true,
    },

    verifyId: {
      type: String,
      required: true,
      unique: true,
    },

    cid: {
      type: String,
      required: true,
    },

    txHash: {
      type: String,
      required: true,
      unique: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
