const express = require("express");
const router = express.Router();

const getTokenRoute = require("./getToken.js");

router.use("/token", getTokenRoute);

module.exports = router;