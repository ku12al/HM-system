const { validationResult } = require("express-validator");
const Hostel = require("../models/Hostel");


const hostelRegister = async (req, res) =>{
      let success = false;
      const errors = validationResult(req);

      if(!errors.isEmpty()){
            return res.status(500).json({success, errors: errors.array() });
      }

      const {hostelname, location} = req.body;

      try{
            const hostel = new Hostel({
                  hostelname,
                  location,

            })

            await hostel.save();
            res.status(200).json({success: true, message: "Hostel registered successfully"});

      }catch(err){
            console.log(err.message);
            res.status(500).send("server error");
      }
}



//get all student in particular hostel
const getAllStudent = async (req, res) => {
      let success = false;
      const errors = validationResult(req);
    
      // Validation errors
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
    
      const { hostel } = req.body;
    
      try {
        // Find hostel
        const shostel = await Hostel.findOne({hostelname: hostel});
    
        
        // If hostel doesn't exist
        if (!shostel) {
          return res.status(404).json({ success: false, errors: [{ message: "Hostel not found" }] });
        }
    
        // Find all students in that hostel
        const students = await Student.find({ hostel: shostel._id }).select("-password");
    
        success = true;
        res.json({ success, students });
      } catch (err) {
        // Return 500 status on server error
        res.status(500).json({ success: false, errors: [{ message: "server error" }] });
      }
    };

module.exports ={
      hostelRegister,
      getAllStudent
}