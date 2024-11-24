const express = require('express');
const router = express.Router();
const {registerStudent,Qrcode, getStudent,getRoomDetails, updatesStudent, deleteStudent} = require("../controller/student")


router.post("/register-student", registerStudent);
router.get("/qr", Qrcode);
router.get("/get-student", getStudent)
router.get("/get-room-details", getRoomDetails);
router.post("/update-student", updatesStudent);
router.post("/delete-student", deleteStudent)

module.exports = router;