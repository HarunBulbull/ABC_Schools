const express = require("express");
const router = express.Router();

const getTokenRoute = require("./getToken.js");
const getOrganizationsRoute = require('./getOrganizations.js');
const getInfoRoute = require('./getInfo.js');
const kuveytRoute = require('./payment/kuveyt.js');
const paytenRoute = require('./payment/payten.js');

router.use("/token", getTokenRoute);
router.use("/organization", getOrganizationsRoute);
router.use("/info", getInfoRoute);
router.use("/kuveyt", kuveytRoute);
router.use("/payten", paytenRoute);

module.exports = router;