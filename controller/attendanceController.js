const { validationResult } = require("express-validator");
const { Attendance, Student, Room } = require("../models/index");

const markAttendance = async (req, res) => {
  try {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({ success, errors: errors.array() });
    }

    const { roomNumber, student, status } = req.body;
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const room = await Room.findOne({ roomNumber }).populate("students");
    if (!room) {
      throw new Error(`Room with room number ${roomNumber} not found`);
    }
    const foundStudent = await Student.findOne({ student: student.erpid });
    if (!foundStudent) {
      return res.status(404).json({ success, error: "Student not found" });
    }
    const alreadyAttendance = await Attendance.findOne({
      student: foundStudent._id,
      date: { $gte: date, $lt: endOfDay },
    });
    if (alreadyAttendance) {
      return res
        .status(500)
        .json({ success, error: "Attendance already marked" });
    }
    const attendance = new Attendance({
      roomNumber: room._id,
      student: foundStudent._id,
      status,
      date: new Date(),
    });
    await attendance.save();
    success = true;
    res.status(201).json({ success, message: "Attendance marked" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: err.message });
  }
};

module.exports = {
  markAttendance,
};
