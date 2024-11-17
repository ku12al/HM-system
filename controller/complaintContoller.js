const Complaint = require("../models/Complaint");
const Student = require("../models/Student");
const User = require("../models/User");

const registerComplaint = async (req, res) => {
  try {
    const { type, description} = req.body;

    const student = await Student.findOne({ user: req.body.userId });

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    // Create a new complaint with the student's details
    const newComplaint = new Complaint({
      student: student._id, // Using the student ID for reference
      hostel: student.hostel, // Assuming 'hostel' is a field in the student document
      room_no: student.room_no, // Assuming 'room_no' is a field in the student document
      type,
      description,
    });
    await newComplaint.save();

    res.json({ success: true, msg: "Complaint registered successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("sever error");
  }
};

const getComplaint = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: "student",
        select: "erpid hostel room name", 
        populate: { path: "room", select: "roomNumber" } // Populate room details within student
      })
      .populate("hostel", "hostelname") // Populate hostel details
      .sort({ date: -1 });

    res.json({ success: true, complaints });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getByStudent = async (req, res) => {
  const { student } = req.body;
  try {
    const complaints = await Complaint.find({ student });
    success = true;
    res.status(200).json({ success, complaints });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("sever error");
  }
};




// Function to simulate sending a notification to the student
const sendNotification = async (studentId, message) => {
  try {
    const student = await Student.findById(studentId);
    if (student) {
      // Send notification to the student (could be email, SMS, or in-app)
      console.log("finowe");
      console.log(`Notification to ${student.name}: ${message}`);
      // You can integrate an email/SMS service here, like Nodemailer for email
    }
  } catch (err) {
    console.error("Error sending notification:", err);
  }
};


const solvedComplaints = async (req, res) => {
  try {
    console.log("Request params:", req.params);

    const complaintId = req.params.id;
    console.log("Complaint ID:", complaintId);

    // Check if complaint ID is undefined
    if (!complaintId) {
      return res.status(400).json({ msg: "Complaint ID is missing" });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    console.log("Updating complaint to 'solved' status...");
    complaint.status = 'Solved';
    await complaint.save();

    console.log("Complaint updated successfully");

    res.json({ success: true, msg: "Complaint marked as solved and notification sent." });
  } catch (err) {
    console.error("Error in solvedComplaints:", err.message);
    res.status(500).send("Server error");
  }
};



const unsolvedComplaint = async (req, res) => {
  try {
    console.log("Request params:", req.params);
    const complaintId = req.params.id;
    const {status, notSolvedReason } = req.body;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, msg: "Complaint not found" });
    }

    complaint.status = status;
    if (status === 'Unsolved') {
      complaint.notSolvedReason = notSolvedReason;
    }

    await complaint.save();
    res.json({ success: true, msg: "Complaint status updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  registerComplaint,
  getComplaint,
  getByStudent,
  solvedComplaints,
  unsolvedComplaint,
};
