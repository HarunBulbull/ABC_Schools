const express = require("express");
const router = express.Router();

const getTokenRoute = require("./getToken.js");
const getOrganizationsRoute = require('./getOrganizations.js');
const getInfoRoute = require('./getInfo.js');

router.use("/token", getTokenRoute);
router.use("/organization", getOrganizationsRoute);
router.use("/info", getInfoRoute);

module.exports = router;