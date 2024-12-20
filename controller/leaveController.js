const { validationResult } = require("express-validator");
const Leave = require("../models/Leave");
const QRCode = require("qrcode");
const Room = require("../models/Rooms");
const Hostel = require("../models/Hostel");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Student = require("../models/Student");

// // Utility: Fetch User by ERP ID
// const findUserByErpId = async (erpid) => {
//   return Student.findOne({ erpid }).populate("student");
// };

// Submit Leave Request for home
const leaveRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  const {
    erpid,
    name,
    roomNumber,
    hostelname,
    parentName,
    parentNumber,
    title,
    reason,
    leaveDate,
    leaveTime,
    returnDate,
  } = req.body;

  try {
    const student = await Student.findOne({ erpid });
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
    console.log(student.name);
    const newLeave = new Leave({
      erpid,
      name: student.name,
      student: student._id,
      roomNumber: room._id,
      hostel: hostel._id,
      parentName,
      parentNumber,
      title,
      reason,
      leaveDate: new Date(leaveDate), // Ensure leaveDate is a valid date
      leaveTime,
      returnDate: returnDate ? new Date(returnDate) : null,
      status: "Pending", // Default status
    });

    await newLeave.save();

    student.leaves = student.leaves || [];
    student.leaves.push(newLeave._id);
    await student.save();

    res
      .status(201)
      .json({ success: true, msg: "Leave application submitted successfully" });
  } catch (err) {
    console.error("Error submitting leave request:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};



const outingRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  console.log("inowne")
  const {
    erpid,
    name,
    roomNumber,
    hostelname,
    title,
    reason,
    leaveDate,
    leaveTime,
  } = req.body;
  console.log("inowne")

  try {
    const student = await Student.findOne({ erpid });
    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }
    console.log("inowne")

    const hostel = await Hostel.findOne({ hostelname });
    if (!hostel) {
      return res.status(404).json({ success: false, msg: "Hostel not found" });
    }
    console.log("inowne")

    const room = await Room.findOne({ roomNumber });
    if (!room) {
      return res.status(404).json({ success: false, msg: "Room not found" });
    }
  console.log("inowne")

    const newLeave = new Leave({
      erpid,
      name: student.name,
      student: student._id,
      roomNumber: room._id,
      hostel: hostel._id,
      title,
      reason,
      leaveDate: new Date(leaveDate), // Ensure leaveDate is a valid date
      leaveTime,
      status: "OutingRequest", // Default status
    });
    console.log("inowne")

    await newLeave.save();

    student.leaves = student.leaves || [];
    student.leaves.push(newLeave._id);
    await student.save();

    res
      .status(201)
      .json({ success: true, msg: "Leave application submitted successfully" });
  } catch (err) {
    console.error("Error submitting leave request:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// Approve Leave Request
const approveLeave = async (req, res) => {
  const leaveId = req.params.id;

  try {
    console.log("jkejfkw");
    const leave = await Leave.findById(leaveId).populate("student");
    console.log("jkejfkw");

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, msg: "Leave request not found" });
    }

    // if (leave.status !== "Pending") {
    //   return res
    //     .status(400)
    //     .json({ success: false, msg: "Leave request already processed" });
    // }
    console.log(leave.status);

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



//decline the outinh request
const declineLeave = async (req, res) => {
  const leaveId = req.params.id;

  try {
    const leave = await Leave.findById(leaveId).populate("student");

    if (!leave) {
      return res
        .status(404)
        .json({ success: false, msg: "Leave request not found" });
    }

    // if (leave.status !== "Pending") {
    //   return res
    //     .status(400)
    //     .json({ success: false, msg: "Leave request already processed" });
    // }

    leave.status = "Decline";
    leave.approvalDate = new Date();


    // // Generate QR Code
    // const qrCodeData = `${leave.student.erpid}-${leave.approvalDate.getTime()}`;
    // const qrCode = await QRCode.toDataURL(qrCodeData);

    // leave.qrcode = qrCode;
    await leave.save();

    res.status(200).json({
      success: true,
      msg: "Leave decline for some Reason",
    });
  } catch (err) {
    console.error("Error approving leave:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};


//get all the details of the leave
const getAllLeaveDetails = async (req, res) => {
  try {
    const { status } = req.query; // Accept status as a query parameter
    const filter = status ? { status: status } : {}; // Apply status filter if provided

    const leaves = await Leave.aggregate([
      { $match: filter }, // Match complaints by status
      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "Pending"] }, then: 1 },
                { case: { $eq: ["$status", "OutingRequest"] }, then: 2 },
                { case: { $eq: ["$status", "Decline"] }, then: 3 },
                { case: { $eq: ["$status", "Approved"] }, then: 4 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { statusPriority: 1, date: -1 } },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" },
      {
        $lookup: {
          from: "rooms", // Join with rooms collection
          localField: "studentDetails.room", // Field in the students collection referencing the room
          foreignField: "_id", // Corresponding field in the rooms collection
          as: "roomDetails", // Field to populate with room details
        },
      },
      { $unwind: "$roomDetails" },
      {
        $project: {
          _id: 1,
          type: 1,
          description: 1,
          status: 1,
          date: 1,
          leaveDate: 1, // Include leave date
          leaveTime: 1, // Include leave time
          returnDate: 1,
          reason: 1,
          "studentDetails.name": 1,
          "roomDetails.roomNumber": 1,
          "studentDetails.erpid": 1,
        },
      },
    ]);

    res.json({ success: true, leaves });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get Leave Details for a Student
const getLeaveDetails = async (req, res) => {
  const leaveId = req.params.id;

  try {
    const leaves = await Leave.find({ student: leaveId });

    if (!leaves || leaves.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          msg: "No leave records found for this student",
        });
    }

    res.status(200).json({ success: true, leaves });
  } catch (err) {
    console.error("Error fetching leave details:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = {
  leaveRequest,
  approveLeave,
  getLeaveDetails,
  getAllLeaveDetails,
  outingRequest,
  declineLeave,

};
