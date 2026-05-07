const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/role.middleware");
const issuerController = require("../controllers/issuer.dashboard.controller");
const recipientController = require("../controllers/recipient.dashboard.controller");

router.get(
  "/issuer",
  authMiddleware,
  requireAdmin,
  issuerController.getIssuerDashboard,
);

router.get(
  "/issuer/documents",
  authMiddleware,
  requireAdmin,
  issuerController.getIssuerDocuments,
);

router.get(
  "/issuer/documents/:id",
  authMiddleware,
  requireAdmin,
  issuerController.getIssuerDocumentById,
);

router.get(
  "/issuer/activity",
  authMiddleware,
  requireAdmin,
  issuerController.getIssuerActivity,
);

router.get(
  "/issuer/analytics",
  authMiddleware,
  requireAdmin,
  issuerController.getIssuerAnalytics,
);

router.get(
  "/recipient",
  authMiddleware,
  recipientController.getRecipientDashboard,
);

router.get(
  "/recipient/documents",
  authMiddleware,
  recipientController.getRecipientDocuments,
);

router.get(
  "/recipient/documents/:id",
  authMiddleware,
  recipientController.getRecipientDocumentById,
);

router.get(
  "/recipient/activity",
  authMiddleware,
  recipientController.getRecipientActivity,
);

module.exports = router;
