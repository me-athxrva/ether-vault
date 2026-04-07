const generateFileHash = require("../utils/hash");
const Document = require("../models/document.model");
const { storeHashOnChain } = require("../services/chain.service");
const { uploadToIPFS } = require("../services/ipfs.service");

async function uploadDocumentController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        status: "failed",
      });
    }

    // generating hash
    const hash = generateFileHash(req.file.buffer);
    const verifyId = "DOC-" + hash.substring(0, 12).toUpperCase();

    // DB duplicate check
    const existingDocument = await Document.findOne({ hash });
    if (existingDocument) {
      return res.status(409).json({
        message: "Document already exists",
        status: "failed",
      });
    }

    // IPFS upload
    const cid = await uploadToIPFS(req.file);

    // storing on blockchain
    const txHash = await storeHashOnChain(hash);

    // db record save
    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      owner: req.user.userId,
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
