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
    },

    cid: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
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

documentSchema.index({ hash: 1 });

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
