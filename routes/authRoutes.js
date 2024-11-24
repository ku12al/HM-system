const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {login, changePassword} = require("../controller/userController");

router.post("/login", login);
router.post("/changepassword", changePassword);

module.exports = router;