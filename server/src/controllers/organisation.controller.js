const Organisation = require("../models/organisation.model");

async function getAllOrganisationsController(req, res) {
  try {
    const organisations = await Organisation.find({}, "name _id");
    return res.status(200).json({
      status: "success",
      data: organisations,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
}

module.exports = {
  getAllOrganisationsController,
};
