const express = require('express');
const router = express.Router();
const ApiController  = require("../controllers/ApiController");

// router.route("/searchTag").post(ApiController.searchTag);

router.route("/getCountryCode").post(ApiController.getCountryCode);

router.route("/performOperation").post(ApiController.performOperation);

module.exports = router;