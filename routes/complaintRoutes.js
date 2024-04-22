const express = require('express');
const { check } = require('express-validator');
const { registerComplaint, getByHostel, resolveComplaint, getByStudent } = require('../controller/complaintContoller');
const router = express.Router();


router.post("/registercomplaint", [
      check('student', "student is required ").not().isEmpty(),
      check('hostel', "hostel is required ").not().isEmpty(),
      check('type', "type is required ").not().isEmpty(),
      check('title', "title is required ").not().isEmpty(),
      check('description', "description is required ").not().isEmpty(),
], registerComplaint);

router.post("/getbyhostel", [
      check('hostel', "hostel is required").not().isEmpty()
], getByHostel)


router.post("/getbystudent", [
      check('student', "student is required").not().isEmpty()
], getByStudent)

router.post("/resolve", [
      check('id', "complaint id is required").not().isEmpty()
], resolveComplaint)


module.exports = router