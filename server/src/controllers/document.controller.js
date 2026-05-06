const generateFileHash = require("../utils/hash");
const Document = require("../models/document.model");
const User = require("../models/user.model");
const { storeHashOnChain } = require("../services/chain.service");
const { uploadToIPFS } = require("../services/ipfs.service");
const crypto = require("crypto");

async function uploadDocumentController(req, res) {
  try {
    const { receiverEmail, title } = req.body || {};

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        status: "failed",
      });
    }

    if (!receiverEmail) {
      return res.status(400).json({
        message: "Receiver email is required",
        status: "failed",
      });
    }

    // Lookup receiver
    const receiver = await User.findOne({ email: receiverEmail });
    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
        status: "failed",
      });
    }

    // Lookup issuer and their organisation
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

    // Check if receiver belongs to the same organisation
    if (!receiver.organisationId || receiver.organisationId.toString() !== issuer.organisationId.toString()) {
      return res.status(403).json({
        message: "You can only issue documents to users within your own organisation.",
        status: "failed",
      });
    }

    // generating hash
    const hash = generateFileHash(req.file.buffer);
    
    // Generating a unique verifyId even for the same hash
    // Format: DOC-[Random 6 chars]-[Hash Prefix]
    const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const verifyId = `DOC-${randomSuffix}-${hash.substring(0, 6).toUpperCase()}`;

    // DB duplicate check within the same organisation
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

    // IPFS upload
    const cid = await uploadToIPFS(req.file);

    // storing on blockchain
    const txHash = await storeHashOnChain(hash);

    // db record save
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
      fileUrl: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`,
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

module.exports = { uploadDocumentController };
