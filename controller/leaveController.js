const { validationResult } = require("express-validator");
const Leave = require("../models/Leave");

const leaveRequest = async (req, res) =>{
      success = false
      const errors = validationResult(req);
      if(!errors.isEmpty()){
            return res.status(200).json({success, errors:errors.array()});
      }
      const {student, hostel, title, reason} = req.body;

      try{
            const newLeave = new Leave({
                  student,
                  hostel,
                  title,
                  reason
            })

            await newLeave.save();
            success = true;
            res.status(400).json({success, msg: "leave application submitted successfull"});

      }catch(err){
            console.log(err);
            res.status(500).send("server error");
      }
}

module.exports = {
      leaveRequest
}