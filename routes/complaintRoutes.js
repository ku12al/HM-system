const express = require('express');
const { check } = require('express-validator');
const { registerComplaint, getComplaint, updateComplaint, getByStudent } = require('../controller/complaintContoller');
const { verifySession } = require('../utils/auth');
const router = express.Router();


router.post("/registercomplaint",verifySession, registerComplaint);

router.get("/getcomplaint",  getComplaint)


router.post("/getbystudent", [
      check('student', "student is required").not().isEmpty()
], getByStudent)

router.post("/resolve", [
      check('id', "complaint id is required").not().isEmpty()
], updateComplaint)


module.exports = router