const crypto = require("crypto");

// changes: hash from file buffer (main use case)
function generateFileHash(buffer) {
  return crypto
    .createHash("sha256")
    .update(buffer)
    .digest("hex");
}

// changes: optional - hash from string (for testing/debug)
function generateStringHash(data) {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex");
}

module.exports = {
  generateFileHash,
  generateStringHash,
};