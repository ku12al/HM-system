const express = require('express');
const { roomRegister, markByStudent } = require('../controller/roomsController');
const router = express.Router();

router.post('/roomregister', roomRegister)
router.get('/students', markByStudent);

module.exports = router