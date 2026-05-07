const Document = require("../models/document.model");
const { logActivity } = require("../utils/activityLogger");

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

    const docs = await Document.find(query)
      .populate("organisationId", "name")
      .populate("issuerId", "name email")
      .populate("receiverId", "name email");

    if (!docs || docs.length === 0) {

      logActivity({
        userId: docs?.[0]?.issuerId?._id || docs?.[0]?.issuerId || null,
        type: "verification_failed",
        message: `Verification failed for ${hash ? `hash: ${hash.substring(0, 12)}...` : `verifyId: ${rawVerifyId}`}`,
        metadata: {
          verifyId: rawVerifyId || null,
        },
      }).catch(() => {});

      return res.status(404).json({
        message: "Document not found or invalid",
        status: "failed",
      });
    }

    for (const d of docs) {
      logActivity({
        userId: d.issuerId?._id || d.issuerId,
        type: "verification_success",
        message: `Document "${d.title}" (${d.verifyId}) verified successfully`,
        metadata: {
          documentId: d._id,
          documentTitle: d.title,
          verifyId: d.verifyId,
          txHash: d.txHash,
        },
        organisationId: d.organisationId?._id || d.organisationId,
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
        isRevoked: d.isRevoked,
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
