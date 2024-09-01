const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
// const admin = require("../models/Warden");
const Hostel = require("../models/Hostel");
const User = require("../models/User");
const { generateToken } = require("../utils/auth");
const Warden= require("../models/Warden");


// admin registration
const registerAdmin = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ errros: errors.array(), success });
  }

  const { name, erpid, email, contact, address, password, hostel } = req.body;

  try {
    let admin = await Warden.findOne({ erpid });

    if (admin) {
      return res
        .status(200)
        .json({ success, error: [{ message: "Admin already exist" }] });
    }

    console.log("kunal1");
    let shostel = await Hostel.findOne({ hostelname: hostel });

    console.log("kunaln8");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    console.log("kunal2");

    let user = new User({
      erpid,
      password: hashPassword,
      isAdmin: true,
    });

    console.log("kunal3");

    await user.save();

    admin = new Admin({
      name,
      erpid,
      email,
      contact,
      address,
      user: user._id,
      hostel: shostel._id,
    });
    console.log("kunal4");

    await admin.save();

    const token = generateToken(user._id, user.isAdmin);
    console.log("kunal5");

    success = true;
    res.status(200).json({ success, token, admin });
    console.log("kunal6");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("sever error");
  }
};



//admin login 
const loginAdmin = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { erpid, password } = req.body;

  try {
    const admin = await Admin.findOne({ erpid });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, error: [{ message: "Admin not found" }] });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, error: [{ message: "Admin not valid" }] });
    }

    const token = generateToken(admin._id, admin.isAdmin);
    console.log(token);

    res.status(400).json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          erpid: admin.erpid,
          isAdmin: admin.isAdmin,
        },
      },
    });
  } catch (error) {
    console.log(error.message);
    return res.status(200).send("server error");
  }
};



module.exports = {
  registerAdmin,
  loginAdmin,
};
