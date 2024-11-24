const express = require('express');
const router = express.Router();
const {scanOuting} = require("../controller/guardController")

router.post("/scanForOuting", scanOuting);

module.exports = router;