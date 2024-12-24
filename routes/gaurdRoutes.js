const express = require('express');
const router = express.Router();
const {scanQrCode, requestAccept, requestDecline} = require("../controller/guardController")

router.post("/scanning-qr-code", scanQrCode);
router.post("/accept-outing", requestAccept);
router.post("/decline-outing", requestDecline);

module.exports = router;