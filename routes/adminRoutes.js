const express = require('express');
const { check } = require('express-validator');
const { registerAdmin } = require('../controller/adminControl');
const router = express.Router();

router.post("/adminregister",[
      check("name", "name is required").not().isEmpty(),
      check("erpid", "erpid is required").not().isEmpty(),
      check("email", "email is required").not().isEmpty(),
      check("contact", "contact is required").not().isEmpty(),
      check("address", "address is required").not().isEmpty(),
      check("password", "password is required").not().isEmpty(),
      check("hostel", "hostel is required").not().isEmpty(),
], registerAdmin);



module.exports = router;