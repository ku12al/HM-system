const express = require('express');
const { check } = require('express-validator');
const { requestRegister, getAll } = require('../controller/requestController');
const router = express.Router();


router.post("/requestregister", [
      check('erpid', "erpid is required").not().isEmpty()
], requestRegister)

router.get("/getall",getAll)


module.exports = router