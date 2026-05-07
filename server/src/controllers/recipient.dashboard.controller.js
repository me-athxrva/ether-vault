const recipientService = require("../services/recipient.dashboard.service");

async function getRecipientDashboard(req, res) {
  try {
    const data = await recipientService.getRecipientDashboardData(
      req.user.userId,
    );

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[RecipientDashboard]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function getRecipientDocuments(req, res) {
  try {
    const data = await recipientService.getRecipientDocuments(
      req.user.userId,
      req.query,
    );

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[RecipientDocuments]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function getRecipientDocumentById(req, res) {
  try {
    const data = await recipientService.getRecipientDocumentById(
      req.params.id,
      req.user.userId,
    );

    if (!data) {
      return res.status(404).json({
        message: "Document not found",
        status: "failed",
      });
    }

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[RecipientDocumentById]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function getRecipientActivity(req, res) {
  try {
    const data = await recipientService.getRecipientActivity(
      req.user.userId,
      req.query,
    );

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[RecipientActivity]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

module.exports = {
  getRecipientDashboard,
  getRecipientDocuments,
  getRecipientDocumentById,
  getRecipientActivity,
};
