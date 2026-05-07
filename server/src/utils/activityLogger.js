const ActivityLog = require("../models/activity.model");

async function logActivity({
  userId,
  type,
  message,
  metadata = {},
  organisationId = null,
}) {
  try {
    await ActivityLog.create({
      userId,
      type,
      message,
      metadata,
      organisationId,
    });
  } catch (err) {

    console.error("[ActivityLog] Failed to write:", err.message);
  }
}

module.exports = { logActivity };
