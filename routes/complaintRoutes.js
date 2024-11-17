const express = require('express');
const { check } = require('express-validator');
const { registerComplaint, getComplaint, unsolvedComplaint, getByStudent, solvedComplaints } = require('../controller/complaintContoller');
const { verifySession } = require('../utils/auth');
const router = express.Router();


router.post("/registercomplaint", registerComplaint);

router.get("/getcomplaint",  getComplaint)


router.post("/getbystudent", getByStudent)

router.post("/unresolved/:id", unsolvedComplaint)

router.put("/resolved/:id", solvedComplaints)


module.exports = router
