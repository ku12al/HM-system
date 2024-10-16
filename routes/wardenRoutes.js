const express = require('express');
const { check } = require('express-validator');
const { registerAdmin,  getWardenData} = require('../controller/wardenControl');
const router = express.Router();

router.post("/admin-register",[
      check("name", "name is required").not().isEmpty(),
      check("erpid", "erpid is required").not().isEmpty(),
      check("email", "email is required").not().isEmpty(),
      check("contact", "contact is required").not().isEmpty(),
      check("address", "address is required").not().isEmpty(),
      check("password", "password is required").not().isEmpty(),
      check("hostel", "hostel is required").not().isEmpty(),
], registerAdmin);

// router.post("/admin-Login",[
//       check('erpid', "erpid id not correct").not().isEmpty(),
//       check('password', "password is required").not().isEmpty()
// ], loginAdmin);

router.get("/get-warden", getWardenData);


module.exports = router;