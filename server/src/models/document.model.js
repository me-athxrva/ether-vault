const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required."],
      trim: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issuerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hash: {
      type: String,
      required: true,
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
    organisationName: {
      type: String,
      required: false,
    },
    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

documentSchema.index({ hash: 1, organisationId: 1 }, { unique: true });

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
