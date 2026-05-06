const express = require("express");
const router = express.Router();
const { getAllOrganisationsController } = require("../controllers/organisation.controller");
const { authLimiter } = require("../middlewares/limiter.middleware");

router.get("/all", authLimiter, getAllOrganisationsController);

module.exports = router;
