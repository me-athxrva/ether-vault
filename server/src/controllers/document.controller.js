const { generateFileHash } = require("../utils/hash");
const Document = require("../models/document.model");
const { uploadToIPFS } = require("../services/ipfs.service");

async function uploadDocumentController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        status: "failed",
      });
    }

    // generate hash
    const hash = generateFileHash(req.file.buffer);

    // check for duplicate document using hash
    try {
      const existingDocument = await Document.findOne({ hash });

      if (existingDocument) {
        return res.status(409).json({
          message: "Document already exists",
          status: "failed",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error",
        status: "failed",
      });
    }

    // upload to IPFS
    const cid = await uploadToIPFS(req.file);

    try {
      // create new document record in DB
      const document = await Document.create({
        title: req.body.title || req.file.originalname,
        owner: req.user.userId,
        hash,
        cid,
        fileUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error",
        status: "failed",
      });
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      // data: {
      //   hash,
      //   cid,
      // },
      status: "success",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Internal server error",
      status: "failed",
    });
  }
}

module.exports = { uploadDocumentController };
