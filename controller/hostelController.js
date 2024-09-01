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

module.exports ={
      hostelRegister
}