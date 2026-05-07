const generateFileHash = require("../utils/hash");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const { storeHashOnChain } = require("../services/chain.service");
const { uploadToIPFS } = require("../services/ipfs.service");
const { logActivity } = require("../utils/activityLogger");
const crypto = require("crypto");

async function uploadDocumentController(req, res) {
  try {
    const { receiverEmail, recipientEmail, title, metadata } = req.body || {};
    const finalEmail = receiverEmail || recipientEmail;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        status: "failed",
      });
    }

    if (!finalEmail) {
      return res.status(400).json({
        message: "Receiver email is required",
        status: "failed",
      });
    }

    const receiver = await User.findOne({ email: finalEmail }).select("+role");
    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
        status: "failed",
      });
    }

    if (receiver.role === "admin") {
      return res.status(403).json({
        message: "You cannot issue documents to an administrator account.",
        status: "failed",
      });
    }

    const issuer = await User.findById(req.user.userId);
    if (!issuer) {
      return res.status(404).json({
        message: "Issuer not found",
        status: "failed",
      });
    }

    if (!issuer.organisationId) {
      return res.status(403).json({
        message: "Your account is not linked to any organisation. Please contact support or register a new issuer account.",
        status: "failed",
      });
    }

    if (!receiver.organisationId || receiver.organisationId.toString() !== issuer.organisationId.toString()) {
      return res.status(403).json({
        message: "You can only issue documents to users within your own organisation.",
        status: "failed",
      });
    }

    const hash = generateFileHash(req.file.buffer);

    const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const verifyId = `DOC-${randomSuffix}-${hash.substring(0, 6).toUpperCase()}`;

    const existingDocument = await Document.findOne({
      hash,
      organisationId: issuer.organisationId
    });

    if (existingDocument) {
      return res.status(409).json({
        message: "Document already issued by your organisation",
        status: "failed",
      });
    }

    const cid = await uploadToIPFS(req.file);

    const txHash = await storeHashOnChain(hash);

    const document = await Document.create({
      title: title || req.file.originalname,
      receiverId: receiver._id,
      issuerId: issuer._id,
      organisationId: issuer.organisationId,
      organisationName: issuer.organisationName,
      hash,
      cid,
      verifyId,
      txHash,
      metadata: metadata ? JSON.parse(metadata) : {},
      fileUrl: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`,
    });

    logActivity({
      userId: issuer._id,
      type: "document_upload",
      message: `Uploaded document "${document.title}" to ${receiver.email}`,
      metadata: {
        documentId: document._id,
        documentTitle: document.title,
        recipientEmail: receiver.email,
        recipientName: receiver.name,
        verifyId: document.verifyId,
        txHash: document.txHash,
        cid: document.cid,
      },
      organisationId: issuer.organisationId,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      data: {
        verifyId: document.verifyId,
        txHash: document.txHash,
      },
      status: "success",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Upload failed",
      status: "failed",
    });
  }
}

async function revokeDocumentController(req, res) {
  try {
    const { id } = req.params;
    const issuerId = req.user.userId;

    const document = await Document.findById(id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
        status: "failed",
      });
    }

    if (document.issuerId.toString() !== issuerId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to revoke this document",
        status: "failed",
      });
    }

    if (document.isRevoked) {
      return res.status(400).json({
        message: "Document is already revoked",
        status: "failed",
      });
    }

    document.isRevoked = true;
    await document.save();

    logActivity({
      userId: issuerId,
      type: "document_revoke",
      message: `Revoked document "${document.title}"`,
      metadata: {
        documentId: document._id,
        documentTitle: document.title,
        verifyId: document.verifyId,
      },
      organisationId: document.organisationId,
    });

    return res.status(200).json({
      message: "Document revoked successfully",
      status: "success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Revocation failed",
      status: "failed",
    });
  }
}

module.exports = { uploadDocumentController, revokeDocumentController };
