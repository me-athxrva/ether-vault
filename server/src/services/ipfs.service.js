const axios = require("axios");
const FormData = require("form-data");

async function uploadToIPFS(file) {
  try {
    const formData = new FormData();

    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.PINATA_JWT}`, // changes: use JWT
        },
      }
    );

    return response.data.IpfsHash;

  } catch (err) {
    console.error("IPFS Upload Error:", err.response?.data || err.message);
    throw new Error("IPFS upload failed");
  }
}

module.exports = { uploadToIPFS };