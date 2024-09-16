const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../utils/auth");
const Student = require("../models/Student");
const Hostel = require("../models/Hostel");
const Room = require("../models/Rooms");
const User = require("../models/User");


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

  try {
    // Check if the student already exists
    const existingStudent = await Student.findOne({ erpid });
    if (existingStudent) {
      return res.status(400).json({ error: [{ message: "Student already exists" }] });
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

    // Find the room
    let room = await Room.findOne({ roomNumber});
    if (!room) {
      return res.status(400).json({ error: "Room not found" });
    }

    // Check room capacity
    if (room.capacity < 1 || room.students.length >= 4) {
      return res.status(400).json({ error: "Room capacity exceeded" });
    }

    // Decrease room capacity
    room.capacity -= 1;

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
    });

    // Save all changes
    await student.save();
    await user.save();
    room.students.push({ student: student._id });
    await room.save();

    // Respond with the newly created student
    res.status(201).json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};






const getStudent = async (req, res) => {
  try {
    const { isAdmin } = req.body;
    if (isAdmin) {
      return res
        .status(200)
        .json({ success, errors: "Admin can not access this route" });
    }
    const { token } = req.body;

    const decode = verifyToken(token);

    const student = await Student.findOne({ password: decode.password }).select("-password");

    if (!student) {
      return res
        .status(400)
        .json({ success: false, errors: "Student not found" });
    }

    success = true;
    res.json({ success, student });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, errors: "server error" });
  }
};





//get all student of data
const getAllStudent = async (req, res) => {
  let success = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { hostel } = req.body;

  try {
    const shostel = await Hostel.findOne({ hostel });

    const students = await Student.find({ hostel: shostel._id }).select("-password");

    success = true;
    res.json({ success, students });
  } catch {
    err;
  }
  {
    console.log(err.message);
    res.status(200).json({ success, errors: [{ message: "server error" }] });
  }
};




//update students
const updatesStudent = async (req, res) => {
  let success = false;
  try {
    const student = await Student.findById(req.body.id).select("-password");

    // Check if student exists
    if (!student) {
      return res.status(404).json({ success: false, errors: [{ message: "Student not found" }] });
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
    res.status(500).json({ success: false, errors: [{ message: "server error" }] });
  }
};




//delete student data ---------
const deleteStudent = async (req, res) => {
  let success = false;
  try{
    
    const error = validationResult(req);

    if(!error.isEmpty()){
      return res.status(200).json({success, error : error.array()});
    }

  const {id} = req.body;

  const student = await Student.findOne({ _id: id }).select('-password');

  if(!student){
    return res.status(400).json({success, error:({message:"student does not exist"})})
  }

  const user = await User.findOneAndDelete(student.user);

  await Student.deleteOne(user);

  success = true;
  res.json({success, message:"student deleted successfully"})
}catch(errors){
  console.log(errors.message);
  return res.status(200).json({success, errors:[{message:"server credentials"}]})
}
}
module.exports = {
  registerStudent,
  getStudent,
  getAllStudent,
  updatesStudent,
  deleteStudent
};
