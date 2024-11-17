const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Hostel = require("../models/Hostel");
const User = require("../models/User");
const { generateToken, verifyToken } = require("../utils/auth");
const Warden = require("../models/Warden")


// admin registration
const registerAdmin = async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ errors: errors.array(), success });
  }

  const { name, erpid, email, contact, address, password, hostel } = req.body;

  try {
    let admin = await Warden.findOne({ erpid });

    if (admin) {
      return res
        .status(200)
        .json({ success, error: [{ message: "Admin already exists" }] });
    }

    let shostel = await Hostel.findOne({ hostelname: hostel });
    if (!shostel) {
      return res.status(404).json({ success, error: [{ message: "Hostel not found" }] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let user = new User({
      erpid,
      password: hashPassword,
      isAdmin: true,
    });

    await user.save(); // Save user first

    admin = new Warden({
      name,
      erpid,
      email,
      contact,
      address,
      user: user._id, // Use user ID after saving
      hostel: shostel._id,
    });

    await admin.save(); // Save admin after user

    const token = generateToken(user._id, user.isAdmin); // Ensure token generation is uncommented

    success = true;
    res.status(200).json({ success, token, admin });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};



//admin login 
// const loginAdmin = async (req, res) => {
//   let success = false;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { erpid, password } = req.body;

//   try {
//     const admin = await Warden.findOne({ erpid });

//     if (!admin) {
//       return res
//         .status(400)
//         .json({ success: false, error: [{ message: "Admin not found" }] });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);

//     if (!isMatch) {
//       return res
//         .status(404)
//         .json({ success: false, error: [{ message: "Admin not valid" }] });
//     }

//     const token = generateToken(admin._id, admin.isAdmin);

//     res.status(400).json({
//       success: true,
//       data: {
//         token,
//         admin: {
//           id: admin._id,
//           erpid: admin.erpid,
//           isAdmin: admin.isAdmin,
//         },
//       },
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(200).send("server error");
//   }
// };


const getWardenData = async(req, res) => {
  try{
    // const { token }= req.body;

    // const decode = verifyToken(token);
    // console.log(decode.isAdmin)

    // if(!decode.isAdmin){
    //   return res.status(200).json({success: false, message: "Admin can't access this route"})
    // }

    const { userId } = req.body;
    // console.log(userId);
    //this code for student password saved in token and decode the password
    const warden = await Warden.findOne({ user: userId })

    // If student is not found
    if (!warden) {
      return res.status(404).json({ success: false, errors: "warden not found" });
    }

    // Send the warden data including the QR code
    res.json({
      success: true,
      warden
    });
  }catch(err){
    console.log(err);
    return res.status(500).send("server error");
  }

}



module.exports = {
  registerAdmin,
  getWardenData
};
