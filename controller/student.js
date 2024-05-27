const express = require("express");
const { Student, Hostel, User, Room } = require("../models/Index");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../utils/auth");


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
    let student = await Student.findOne({ erpid });
    if (student) {
      return res
        .status(400)
        .json({ error: [{ message: "Student already exists" }] });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new User({
      erpid,
      password: hashPassword,
      isAdmin: false,
    });
    const hostel = await Hostel.findOne({ hostelname: hostelname });
    if (!hostel) {
      return res.status(400).json({ error: "Hostel not found" });
    }
    let room = await Room.findOne({ roomNumber});
    if (!room) {
      return res.status(400).json({ error: "Room not found" });
    }
    if (room.capacity < 1) {
      return res.status(400).json({ error: "Room capacity exceeded" });
    }
    room.capacity -= 1;
    student = new Student({
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
      room: room._id
    });
    await student.save();
    await user.save();
    room.students.push({student:student._id})
    await room.save();
    
    res.status(201).json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};




const getStudent = async (req, res) => {
  try {
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
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





//update student information
const updatesStudent = async (req, res) => {
  let success = false;
  try {
    const student = await Student.findById(req.student.id).select("-password");
    console.log(student);

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
      // password,
      hostel,
    } = req.body;

    student.name = name;
    student.erpid = erpid;
    student.email = email;
    student.phone = phone;
    student.room = room;
    student.year = year;
    student.dept = dept;
    student.course = course;
    student.father_name = father_name;
    student.address = address;
    student.dob = dob;
    student.hostel = hostel;

    await student.save();

    success = true;
    res.json({ success, student });
  } catch (err) {
    console.log(err.message);
    res.status(200).json({ success, errors: [{ message: "server error" }] });
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
