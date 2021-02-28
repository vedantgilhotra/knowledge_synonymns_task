const express = require('express');
const router = express.Router();
const ApiController  = require("../controllers/ApiController");

// router.route("/searchTag").post(ApiController.searchTag);

router.route("/getCountryCode").post(ApiController.getCountryCode);

router.route("/processUserInformation").post(ApiController.processUserInformation);

module.exports = router;