const { validationResult } = require("express-validator");
const Hostel = require("../models/Hostel");
const Student = require("../models/Student");

const hostelRegister = async (req, res) => {
  let success = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(500).json({ success, errors: errors.array() });
  }

  const { hostelname, location, capacity, rooms } = req.body;

  try {
    const hostel = new Hostel({
      hostelname,
      location,
      capacity,
      rooms
    });

    await hostel.save();
    res
      .status(200)
      .json({ success: true, message: "Hostel registered successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
};

//get all student in particular hostel
const getAllStudentByHostel = async (req, res) => {
  console.log("jonsoeioe")
  const id = req.query;
  console.log(id)

  try {
    // Find hostel
  console.log("jonsoeioe")

    const shostel = await Hostel.findOne({ _id: id });
  console.log("jonsoeioe")

console.log(shostel)
    // If hostel doesn't exist
    if (!shostel) {
      return res
        .status(404)
        .json({ success: false, errors: [{ message: "Hostel not found" }] });
    }
    console.log("jonsoeioe")

    // Find all students in that hostel
    const students = await Student.find({ hostel: shostel._id }).select(
      "-password"
    );

    success = true;
    res.json({ success, shostel });
  } catch (err) {
    // Return 500 status on server error
    res
      .status(500)
      .json({ success: false, errors: [{ message: "server error" }] });
  }
};

module.exports = {
  hostelRegister,
  getAllStudentByHostel,
};
