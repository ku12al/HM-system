const express = require('express');
const { check } = require('express-validator');
const { roomRegister, markByStudent } = require('../controller/roomsController');
const router = express.Router();

router.post('/roomregister', [
      check('hostelname', "hostel is required").not().isEmpty(),
      check('roomNumber', "roomNumber is required").not().isEmpty(),
      check('capacity', "capacity is required").not().isEmpty()
], roomRegister)

router.get('/students',  [
      check('roomNumber', "roomNumber is required").not().isEmpty(),
],markByStudent);

module.exports = router