const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "document_upload",
        "document_revoke",
        "verification_success",
        "verification_failed",
        "login",
        "logout",
      ],
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
    },

    metadata: {
      documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
      documentTitle: String,
      recipientEmail: String,
      recipientName: String,
      issuerEmail: String,
      issuerName: String,
      verifyId: String,
      txHash: String,
      cid: String,
      ip: String,
    },

    organisationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ organisationId: 1, createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
