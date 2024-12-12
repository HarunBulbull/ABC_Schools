const express = require("express");
const router = express.Router();

const getTokenRoute = require("./getToken.js");
const getOrganizationsRoute = require('./getOrganizations.js');
const getInfoRoute = require('./getInfo.js');
const paymentRoute = require('./payment.js');
const paytenRoute = require('./payten.js');

router.use("/token", getTokenRoute);
router.use("/organization", getOrganizationsRoute);
router.use("/info", getInfoRoute);
router.use("/payment", paymentRoute);
router.use("/payten", paytenRoute);

module.exports = router;