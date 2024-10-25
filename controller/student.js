const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../utils/auth");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Room = require("../models/Rooms");
const User = require("../models/User");
const QRCode = require("qrcode");
const { default: mongoose } = require("mongoose");

//new registration for student ------
const registerStudent = async (req, res) => {
  const {
    name,
    erpid,
    gender,
    email,
    phone,
    year,
    dept,
    course,
    father_name,
    address,
    dob,
    password,
    hostelname,
    roomNumber,
  } = req.body;

  const session = await mongoose.startSession(); // Start session for transaction
  session.startTransaction();
  try {
    // Check if the student already exists
    const existingStudent = await Student.findOne({ erpid });
    if (existingStudent) {
      return res
        .status(400)
        .json({ error: [{ message: "Student already exists" }] });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = new User({
      erpid,
      password: hashPassword,
      isAdmin: false,
    });

    // Find the hostel
    const hostel = await Hostel.findOne({ hostelname });
    if (!hostel) {
      return res.status(400).json({ error: "Hostel not found" });
    }

    // Find the room, or create a new one if it doesn't exist
    // let room = await Room.findOne({ roomNumber });
    // if (!room) {
    //   room = new Room({
    //     roomNumber,
    //     capacity: 4,
    //     students: [],
    //     hostel: hostel._id,
    //   });
    //   await room.save();
    // }

    let room = await Room.findOneAndUpdate(
      { roomNumber, hostel: hostel._id },
      {
        $setOnInsert: {
          roomNumber,
          hostel: hostel._id,
          capacity: 4,
          students: [],
        },
      },
      { new: true, upsert: true, session }
    );

    // Check room capacity
    if (room.students.length >= room.capacity) {
      return res.status(400).json({ error: "Room capacity exceeded" });
    }

    // QR Code generation
    let qrImageData;
    try {
      const qrText = erpid.toString();
      const qrImage = await QRCode.toDataURL(qrText);

      // Base64 encoding to send as image
      qrImageData = qrImage.replace(/^data:image\/png;base64,/, "");
    } catch (qrError) {
      return res.status(500).json({ error: "Failed to generate QR code" });
    }

    // Create the student
    const student = new Student({
      name,
      erpid,
      gender,
      email,
      phone,
      year,
      dept,
      course,
      father_name,
      address,
      dob,
      user: user._id,
      hostel: hostel._id,
      room: room._id,
      qrCode: qrImageData,
    });

    // Save all changes
    await user.save();
    await student.save();
    room.students.push({ student: student._id });
    await room.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    // res.json({ message: "Student created successfully" });
    // Set the response header to indicate that this is an image
    res.setHeader("Content-Type", "image/png");

    // Send the image as a Buffer
    res.send(Buffer.from(qrImageData, "base64"));
  } catch (err) {
    await session.abortTransaction(); // Rollback on error
    session.endSession();
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


//qr for student registration
const Qrcode = async (req, res) => {
  try {
    const text = req.query.text;
    if (!text) {
      return res
        .status(400)
        .json({ error: "Please provide a text to generate a QR" });
    }

    const qrImage = await QRCode.toDataURL(text);
    const qrImageData = qrImage.replace(/^data:image\/png;base64,/, "");
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(qrImageData, "base64"));
  } catch (err) {
    console.error(err);
  }
};


//get student data through student passwrod tokken
const getStudent = async (req, res) => {
  try {
    const { userId } = req.body;

    // const decode = verifyToken(token);
    // console.log(decode)

    // // Check if the user is an admin
    // if (decode.isAdmin) {
    //   return res
    //     .status(403)
    //     .json({ success: false, error: "Admin cannot access student data" });
    // }
    const student = await Student.findOne({ user: userId })
      .populate({
        path: "room", // Populate the room details
        select: "roomNumber", // Only select the room number field
      })
      .populate({
        path: "hostel", // Populate the hostel details
        select: "hostelname", // Only select the hostel name field
      });

    // If student is not found
    if (!student) {
      return res
        .status(404)
        .json({ success: false, errors: "Student not found" });
    }

    // Send the student data including the QR code
    res.json({
      success: true,
      student,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, errors: "server error" });
  }
};



//get room details of the student
const getRoomDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    const student = await Student.findOne({ user: userId });

    // console.log(student);

    if (!student) {
      return res
        .status(404)
        .json({ success: false, error: "student not exists" });
    }

    const roomDetails = await Room.findOne({ _id: student.room }).populate({
      path: "students.student", // Populate the 'student' field inside 'students' array
      select: "name", // Only select the 'name' field of the student
    }).populate({
      path: "hostel", // Populate the hostel details
      select: "hostelname", // Only select the hostel name field
    });


    if (!roomDetails) {
      return res
        .status(404)
        .json({ success: false, error: "Room details not found" });
    }

    // Return the room details
    res.status(200).json({ success: true, roomDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, errors: "server error" });
  }
};





//update students
const updatesStudent = async (req, res) => {
  let success = false;
  try {
    const student = await Student.findById(req.body.id).select("-password");

    // Check if student exists
    if (!student) {
      return res
        .status(404)
        .json({ success: false, errors: [{ message: "Student not found" }] });
    }

    const {
      name,
      erpid,
      email,
      phone,
      room,
      year,
      dept,
      course,
      father_name,
      address,
      dob,
      hostel,
    } = req.body;

    // Optional: Add checks for the fields you expect to update
    if (name) student.name = name;
    if (erpid) student.erpid = erpid;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (room) student.room = room;
    if (year) student.year = year;
    if (dept) student.dept = dept;
    if (course) student.course = course;
    if (father_name) student.father_name = father_name;
    if (address) student.address = address;
    if (dob) student.dob = dob;
    if (hostel) student.hostel = hostel;

    await student.save();

    success = true;
    res.json({ success, student });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ success: false, errors: [{ message: "server error" }] });
  }
};







//delete student data ---------
const deleteStudent = async (req, res) => {
  let success = false;
  // Start transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }

    const { id } = req.body;
    // Validate that the ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success, error: [{ message: "Student ID is required" }] });
    }

    // Find the student by id
    const student = await Student.findById(id).session(session);
    if (!student) {
      return res
        .status(404)
        .json({ success, error: { message: "Student does not exist" } });
    }

    // Find and delete the associated user
    const user = await User.findByIdAndDelete(student.user).session(session);
    if (!user) {
      return res
        .status(404)
        .json({ success, error: { message: "Associated user not found" } });
    }

    // Find the room associated with the student
    const room = await Room.findById(student.room).session(session);
    if (!room) {
      return res
        .status(404)
        .json({ success, error: { message: "Room not found" } });
    }

    // Remove the student from the room's list of students (access the 'student' key inside each object)
    room.students = room.students.filter(
      (studentObj) => studentObj.student.toString() !== id.toString()
    );
    // Increase the room capacity (optional: depends on how you manage room capacity)
    // room.capacity += 1;

    // Save the updated room document
    await room.save({ session });

    // Delete the student
    await Student.findByIdAndDelete(id).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    success = true;
    res.json({ success, message: "Student deleted successfully" });
  } catch (errors) {
    await session.abortTransaction();
    session.endSession();
    console.error(errors); // Log full error object to capture any possible issues
    return res
      .status(500)
      .json({ success: false, errors: [{ message: "Server error" }] });
  }
};

module.exports = {
  registerStudent,
  getStudent,
  getRoomDetails,
  updatesStudent,
  deleteStudent,
  Qrcode,
};
