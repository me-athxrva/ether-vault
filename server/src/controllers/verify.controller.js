const Document = require("../models/document.model");
const generateFileHash = require("../utils/hash");

async function verifyDocController(req, res) {
  try {
    let doc;

    if (req.file && req.body.verifyId) {
      return res.status(400).json({
        message: "Provide either file or verifyId, not both",
      });
    }

    // file verification
    if (req.file) {
      const hash = generateFileHash(req.file.buffer);
      doc = await Document.findOne({ hash });
    }

    // id verification
    else if (req.body.verifyId) {
      let verifyId = req.body.verifyId.trim().toUpperCase();
      verifyId = `DOC-${verifyId}`;

      doc = await Document.findOne({ verifyId });
    } else {
      return res.status(400).json({
        message: "Provide either file or verifyId",
        status: "failed",
      });
    }

    if (!doc) {
      return res.status(404).json({
        message: "Document not found or invalid",
        status: "failed",
      });
    }

    return res.status(200).json({
      message: "Document verified successfully",
      data: {
        verifyId: doc.verifyId,
        title: doc.title,
        // fileUrl: `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${doc.cid}`,
        cid: doc.cid,
        issuedAt: doc.createdAt,
      },
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
