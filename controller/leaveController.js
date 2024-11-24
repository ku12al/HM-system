const { validationResult } = require("express-validator");
const Leave = require("../models/Leave");
const QRCode = require("qrcode");
const Room = require("../models/Rooms");
const Hostel = require("../models/Hostel");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// Utility: Fetch User by ERP ID
const findUserByErpId = async (erpid) => {
  return User.findOne({ erpid }).populate("leaves");
};

// Submit Leave Request
const leaveRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { erpid, roomNumber, hostelname, parentName, parentNumber, title, reason } = req.body;

  try {
    const student = await findUserByErpId(erpid);
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const hostel = await Hostel.findOne({ hostelname });
    if (!hostel) {
      return res.status(404).json({ success: false, msg: "Hostel not found" });
    }

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ success: false, msg: "Room not found" });
    }

    const newLeave = new Leave({
      erpid,
      student: student._id,
      roomNumber: room._id,
      hostel: hostel._id,
      parentName,
      parentNumber,
      title,
      reason,
    });

    await newLeave.save();

    student.leaves = student.leaves || [];
    student.leaves.push(newLeave._id);
    await student.save();

    res.status(201).json({ success: true, msg: "Leave application submitted successfully" });
  } catch (err) {
    console.error("Error submitting leave request:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Approve Leave Request
const approveLeave = async (req, res) => {
  const { leaveId } = req.body;

  try {
    const leave = await Leave.findById(leaveId).populate("student");

    if (!leave) {
      return res.status(404).json({ success: false, msg: "Leave request not found" });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({ success: false, msg: "Leave request already processed" });
    }

    leave.status = "Approved";
    leave.approvalDate = new Date();

    // Mark attendance as leave
    const attendance = new Attendance({
      student: leave.student._id,
      status: "Leave",
      date: new Date(),
    });
    await attendance.save();

    // Generate QR Code
    const qrCodeData = `${leave.student.erpid}-${leave.approvalDate.getTime()}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);

    leave.qrcode = qrCode;
    await leave.save();

    res.status(200).json({
      success: true,
      msg: "Leave approved and QR code generated",
      qrCode,
    });
  } catch (err) {
    console.error("Error approving leave:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Get Leave Details for a Student
const getLeaveDetails = async (req, res) => {
  const { erpid } = req.params;

  try {
    const student = await findUserByErpId(erpid);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    res.status(200).json({ success: true, leaves: student.leaves });
  } catch (err) {
    console.error("Error fetching leave details:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = {
  leaveRequest,
  approveLeave,
  getLeaveDetails,
};
