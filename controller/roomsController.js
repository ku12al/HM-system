const { validationResult } = require("express-validator");
const Hostel = require("../models/Hostel");
const Room = require("../models/Rooms");

const roomRegister = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ success, errors: errors.array() });
  }

  const { hostelname, roomNumber, capacity } = req.body;
  try {
    const shostel = await Hostel.findOne({ hostelname: hostelname });
    if (!shostel) {
      return res.status(400).json({ message: "hostel not found" });
    }
    let room = await Room.findOne({ roomNumber });
    if (room) {
      return res
        .status(400)
        .json({ error: [{ message: "room already exists" }] });
    }
    room = new Room({
      hostelname,
      roomNumber,
      capacity,
    });
    await room.save();
    success = true;
    return res
      .status(200)
      .json({ success, message: "room create successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
};

// Endpoint to get students assigned to a room
const markByStudent = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ success, errors: errors.array() });
  }
  const { roomNumber } = req.body;
  try {
    const room = await Room.findOne({ roomNumber: roomNumber }).populate(
      "students"
    );
    console.log(room);
    if (!room) {
      throw new Error(`Room with room number ${roomNumber} not found`);
    }
    const students = room.students.map((student) => ({
      _id: student._id,
      name: student.student,
    }));
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  roomRegister,
  markByStudent,
};
