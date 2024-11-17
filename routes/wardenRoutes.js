const express = require('express');
const { check } = require('express-validator');
const { registerAdmin,  getWardenData} = require('../controller/wardenControl');
const router = express.Router();

router.post("/admin-register", registerAdmin);

// router.post("/admin-Login",[
//       check('erpid', "erpid id not correct").not().isEmpty(),
//       check('password', "password is required").not().isEmpty()
// ], loginAdmin);

router.get("/get-warden/:id", getWardenData);


module.exports = router;