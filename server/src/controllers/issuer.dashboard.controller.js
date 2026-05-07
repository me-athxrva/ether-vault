const User = require("../models/user.model");
const issuerService = require("../services/issuer.dashboard.service");

async function getIssuerDashboard(req, res) {
  try {
    const issuer = await User.findById(req.user.userId);
    if (!issuer || !issuer.organisationId) {
      return res.status(403).json({
        message: "Account not linked to any organisation",
        status: "failed",
      });
    }

    const data = await issuerService.getIssuerDashboardData(
      req.user.userId,
      issuer.organisationId,
    );

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[IssuerDashboard]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function getIssuerDocuments(req, res) {
  try {
    const issuer = await User.findById(req.user.userId);
    if (!issuer || !issuer.organisationId) {
      return res.status(403).json({
        message: "Account not linked to any organisation",
        status: "failed",
      });
    }

    const data = await issuerService.getIssuerDocuments(
      issuer.organisationId,
      req.query,
    );

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[IssuerDocuments]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function getIssuerDocumentById(req, res) {
  try {
    const issuer = await User.findById(req.user.userId);
    if (!issuer || !issuer.organisationId) {
      return res.status(403).json({
        message: "Account not linked to any organisation",
        status: "failed",
      });
    }

    const data = await issuerService.getIssuerDocumentById(
      req.params.id,
      issuer.organisationId,
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
    console.error("[IssuerDocumentById]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function getIssuerActivity(req, res) {
  try {
    const issuer = await User.findById(req.user.userId);
    if (!issuer || !issuer.organisationId) {
      return res.status(403).json({
        message: "Account not linked to any organisation",
        status: "failed",
      });
    }

    const data = await issuerService.getIssuerActivity(
      issuer.organisationId,
      req.query,
    );

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[IssuerActivity]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

async function getIssuerAnalytics(req, res) {
  try {
    const issuer = await User.findById(req.user.userId);
    if (!issuer || !issuer.organisationId) {
      return res.status(403).json({
        message: "Account not linked to any organisation",
        status: "failed",
      });
    }

    const data = await issuerService.getIssuerAnalytics(
      issuer.organisationId,
    );

    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("[IssuerAnalytics]", err);
    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

module.exports = {
  getIssuerDashboard,
  getIssuerDocuments,
  getIssuerDocumentById,
  getIssuerActivity,
  getIssuerAnalytics,
};
