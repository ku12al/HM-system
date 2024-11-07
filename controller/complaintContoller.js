const { validationResult } = require("express-validator");
const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

const registerComplaint = async (req, res) =>{
      try{
            const { erpid, type, description } = req.body;
             // Fetch the student's details from the database
            const student = await Student.findOne({ erpid }); // Assuming 'Student' is your student model

            if (!student) {
                  return res.status(404).json({ success: false, msg: 'Student not found' });
            }
 
             // Create a new complaint with the student’s details
            const newComplaint = new Complaint({
                  student: student._id, // Using the student ID for reference
                  hostel: student.hostel, // Assuming 'hostel' is a field in the student document
                  room_no: student.room_no, // Assuming 'room_no' is a field in the student document
                  type,
                  description
            });
            await newComplaint.save();
            success = true
            res.json({success, msg: 'complaint registered successfully'});

      }catch(err){
            console.log(err.message);
            res.status(500).send("sever error")
      }
}


const getComplaint = async (req, res) => {
      try {
            // Fetch complaints and populate with student details
            const complaints = await Complaint.find()
                  .populate('student', 'erpid hostel room_no name') // Populate specific fields from Student model
                  .sort({ createdAt: -1 }); // Optional: Sort by latest complaints

            res.json({ success: true, complaints });
      } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
      }
};



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
      getComplaint,
      getByStudent,
      resolveComplaint
}