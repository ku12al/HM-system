const { validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");


const registerComplaint = async (req, res) =>{
      try{
            const {student, hostel, room_no, type, description} = req.body;
            const newComplaint = new Complaint({
                  student:student.erpid,
                  hostel :hostel.hostelname,
                  room_no:room_no.roomNumber,
                  type,
                  description
            })
            await newComplaint.save();
            success = true
            res.json({success, msg: 'complaint registered successfully'});

      }catch(err){
            console.log(err.message);
            res.status(500).send("sever error")
      }
}


const getByHostel = async (req, res) =>{
      const {hostel}= req.body;

      try{
            const complaint = await Complaint.find({hostel}).populate('student', ["name", "room"]);
            success = true
            res.status(200).json({success, complaint})
      }catch(err){
            console.log(err.message);
            res.status(500).send("server error")
      }
}


const getByStudent = async (req, res) => {
      const {student} = req.body;
      try{
            const complaints = await Complaint.find({student});
            success = true;
            res.status(200).json({success, complaints});

      }catch(error){
            console.log(error.message);
            res.status(500).send("sever error");
      }
}


const resolveComplaint = async (req, res) => {
      let success = false;
      const errors = validationResult(req);
      if(!errors.isEmpty()){
            return res.status(500).json({errors: errors.array(), success});
      }

      const {id} = req.body;
      try{
            const complaint  = await Complaint.findById(id);
            complaint.status = "solved";
            await complaint.save();
            success = true;
            res.status(200).send({success});

      }catch(error){
            console.log(error.message);
            res.status(500).send("sever error");
      }
}


module.exports = {
      registerComplaint,
      getByHostel,
      getByStudent,
      resolveComplaint
}