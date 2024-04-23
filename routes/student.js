const express = require('express');
const router = express.Router();

const {check} = require('express-validator');
const {registerStudent, getStudent, getAllStudent, updatesStudent, deleteStudent} = require("../controller/student")


router.post("/register-student",[
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'email is required').isEmail(),
      check('room', 'Room number is required').not().isEmpty(),
      check('erpid', 'Erpid is required').not().isEmpty(),
      check('phone', 'Enter a valid contact number').isLength(11),
      check('year', 'Year is required').not().isEmpty(),
      check('dept', 'Room number is required').not().isEmpty(),
      check('course', 'Room number is required').not().isEmpty(),
      check('father_name', 'Room number is required').not().isEmpty(),
      check('address', 'Room number is required').not().isEmpty(),
      check('dob', 'Room number is required').not().isEmpty(),
      check('hostel', 'Room number is required').not().isEmpty(),
      check('password', 'Please enter a password with 8 or more characters').isLength({min: 8}),

], registerStudent);

router.post("/get-student", [
      check('isAdmin', 'isAdmin is required').notEmpty(),
      check('token', 'You donot have a valid token').notEmpty()
], getStudent)

router.post("/get-all-student",[
      check('hostel', 'Hostel is required').not().isEmpty()
], getAllStudent)

router.post("/update-student",[
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'email is required').isEmail(),
      check('room', 'Room number is required').not().isEmpty(),
      check('erpid', 'Erpid is required').not().isEmpty(),
      check('phone', 'Enter a valid contact number').isLength(11),
      check('year', 'Year is required').not().isEmpty(),
      check('dept', 'Room number is required').not().isEmpty(),
      check('course', 'Room number is required').not().isEmpty(),
      check('father_name', 'Room number is required').not().isEmpty(),
      check('address', 'Room number is required').not().isEmpty(),
      check('dob', 'Room number is required').not().isEmpty(),
      check('hostel', 'Room number is required').not().isEmpty(),
      // check('user', 'User is required').not().isEmpty(),

], updatesStudent);

router.post("/delete-student",[
      check('id', 'Enter a valid ID').not().isEmpty(),
], deleteStudent)

module.exports = router;