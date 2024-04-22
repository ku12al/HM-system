const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {login, changePassword} = require("../controller/userController");


router.post("/login",[
      check('erpid', "erpid id not correct").not().isEmpty(),
      check('password', "password is required").not().isEmpty()
], login);

router.post("/changepassword", [
      check('password', "password is required").not().isEmpty(),
], changePassword);

module.exports = router;