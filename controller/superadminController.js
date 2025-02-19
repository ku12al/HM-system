const Complaint = require("../models/Complaint");
const bcrypt = require("bcryptjs");
const Superadmin = require("../models/Superadmin");


const registerSuperAdmin = async (req, res) => {
  try{
    const {name, erpid, password} = req.body;
    const admin = await Superadmin.findOne({erpid});
    if(admin){
      return res.status(400).json({success: false, msg: "admin already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const newAdmin = new Superadmin({
      name,
      erpid,
      password: hashpassword
    })


    await newAdmin.save();

    return res.status(200).json({success: true, msg: "admin registered successfully"});
  }catch(err){
    res.status(500).json({success: false, msg: err.message})
  }
}


const loginSuperAdmin = async (req, res)=>{
  try{
    const {erpid, password} = req.body;

    const admin = await Superadmin.findOne({erpid});
    if(!admin){
      return res.status(400).json({success: false, msg: "admin not found"});
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if(!isMatch){
      return res.status(404).json({success: false, msg: "password not match"});
    }

    return res.status(200).json({success: true, admin});

  }catch(err){
    return rew.status(500).json({success: false, msg: err.message});
  }
}


//get data of super admin
const getSuperAdmin = async (req, res) => {
  try{
    const superAdmin = await Superadmin.findById(req.params.id);
    // If student is not found
    if (!superAdmin) {
      return res.status(404).json({ success: false, errors: "Super Admin not found" });
    }
    return res.status(200).json({success: true, superAdmin});

    

  }catch(error){
    return res.status(500).json({success: false, msg: error.message});
  }
}
const getAllComplaint = async (req, res) => {
  try {
    // Filter to show only unsolved complaints
    const filter = { status: "unsolved" };

    const complaints = await Complaint.aggregate([
      { $match: filter }, // Match complaints with status "unsolved"
      { $sort: { date: -1 } }, // Sort by most recent date
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" }, // Deconstruct studentDetails array
      {
        $project: {
          _id: 1,
          type: 1,
          description: 1,
          status: 1,
          date: 1,
          "studentDetails.name": 1,
          "studentDetails.room_no": 1,
        },
      },
    ]);

    res.json({ success: true, complaints });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getAllComplaint,
  registerSuperAdmin,
  loginSuperAdmin,
  getSuperAdmin
};
