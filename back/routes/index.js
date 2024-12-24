const express = require("express");
const router = express.Router();

// ! K12
const getTokenRoute = require("./k12/getToken.js");
const getOrganizationsRoute = require('./k12/getOrganizations.js');
const getInfoRoute = require('./k12/getInfo.js');

router.use("/token", getTokenRoute);
router.use("/organization", getOrganizationsRoute);
router.use("/info", getInfoRoute);


// ! Bankalar
const kuveytRoute = require('./payment/kuveyt.js');
const garantiRoute = require('./payment/garanti.js');
const ykbRoute = require('./payment/yapikredi.js');
const qnbRoute = require('./payment/finansbank.js');

router.use("/kuveyt", kuveytRoute);
router.use("/garanti", garantiRoute);
router.use("/ykb", ykbRoute);
router.use("/qnb", qnbRoute);


// ! Mongo
const countsRoute = require('./mongo/counts.js');

router.use("/counts", countsRoute);

module.exports = router;