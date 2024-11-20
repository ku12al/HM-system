const express = require('express');
const { check } = require('express-validator');
const { registerComplaint, getComplaint, unsolvedComplaint, solvedComplaints, getComplaintByStudent, updateComplaintStatus } = require('../controller/complaintContoller');
const { verifySession } = require('../utils/auth');
const router = express.Router();


router.post("/registercomplaint", registerComplaint);

router.get("/getcomplaint",  getComplaint)


// router.post("/getbystudent", getByStudent)

router.post("/unresolved/:id", unsolvedComplaint)

router.put("/resolved/:id", solvedComplaints)

router.get("/getstudentbyid/:id", getComplaintByStudent);

router.patch("/complaintBy/:id/status", updateComplaintStatus);


module.exports = router
