const express = require('express');
const { requestRegister, getAll } = require('../controller/requestController');
const router = express.Router();


router.post("/requestregister", requestRegister)
router.get("/getall",getAll)


module.exports = router