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
            console.log("inoiwe")
            const complaints = await Complaint.find()
                  .populate('student', 'erpid hostel room_no name')
                  .sort({ date: -1 });
            console.log("inoiwe")


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


const updateComplaint = async (req, res) => {
      try {
            const { complaintId, status, notSolvedReason } = req.body;
            const complaint = await Complaint.findById(complaintId);
            if (!complaint) {
                  return res.status(404).json({ success: false, msg: 'Complaint not found' });
            }

            complaint.status = status;
            if (status === 'decline') {
                  complaint.notSolvedReason = notSolvedReason;
            }

            await complaint.save();
            res.json({ success: true, msg: 'Complaint status updated successfully' });
      } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
      }
}


module.exports = {
      registerComplaint,
      getComplaint,
      getByStudent,
      updateComplaint
}