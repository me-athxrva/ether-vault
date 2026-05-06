const Document = require("../models/document.model");

async function verifyDocController(req, res) {
  try {
    const { hash, verifyId: rawVerifyId } = req.body || {};
    let query = {};

    if (hash && rawVerifyId) {
      return res.status(400).json({
        message: "Provide either hash or verifyId, not both",
        status: "failed",
      });
    }

    if (hash) {
      query = { hash };
    } else if (rawVerifyId) {
      let vId = rawVerifyId.trim().toUpperCase();
      if (!vId.startsWith("DOC-")) {
        vId = `DOC-${vId}`;
      }
      query = { verifyId: vId };
    } else {
      return res.status(400).json({
        message: "Provide either document hash or verification ID",
        status: "failed",
      });
    }

    // Find documents and populate all related names
    const docs = await Document.find(query)
      .populate("organisationId", "name")
      .populate("issuerId", "name email")
      .populate("receiverId", "name email");

    if (!docs || docs.length === 0) {
      return res.status(404).json({
        message: "Document not found or invalid",
        status: "failed",
      });
    }

    return res.status(200).json({
      message: "Document(s) verified successfully",
      count: docs.length,
      results: docs.map((d) => ({
        verifyId: d.verifyId,
        title: d.title,
        organisation: d.organisationId?.name || d.organisationName,
        issuer: d.issuerId?.name || "Unknown Issuer",
        receiver: d.receiverId?.name || "Unknown Receiver",
        txHash: d.txHash,
        issuedAt: new Date(d.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      status: "success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "failed",
    });
  }
}

module.exports = verifyDocController;
