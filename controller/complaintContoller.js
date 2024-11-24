const Complaint = require("../models/Complaint");
const Student = require("../models/Student");

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

    res.json({ success: true, msg: "Complaint registered successfully", newComplaint});
  } catch (err) {
    console.log(err.message);
    res.status(500).send("sever error");
  }
};



//this is get all complaint for every pages
const getComplaint = async (req, res) => {
  try {
    const { status } = req.query; // Accept status as a query parameter
    const filter = status ? { status: status } : {}; // Apply status filter if provided

    const complaints = await Complaint.aggregate([
      { $match: filter }, // Match complaints by status
      {
        $addFields: {
          statusPriority: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "unsolved"] }, then: 2 },
                { case: { $eq: ["$status", "solved"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { statusPriority: 1, date: -1 } },
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" },
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


// // Function to simulate sending a notification to the student
// const sendNotification = async (studentId, message) => {
//   try {
//     const student = await Student.findById(studentId);
//     if (student) {
//       // Send notification to the student (could be email, SMS, or in-app)
//       console.log("finowe");
//       console.log(`Notification to ${student.name}: ${message}`);
//       // You can integrate an email/SMS service here, like Nodemailer for email
//     }
//   } catch (err) {
//     console.error("Error sending notification:", err);
//   }
// };



//warden press the button for solved the complaint
const solvedComplaints = async (req, res) => {
  try {

    const complaintId = req.params.id; // complaint id 
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



//warden press button to ignore the complaint
const unsolvedComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id; //complaint id
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



//get own complaint student by id means student get complait own complaint in own app
const getComplaintByStudent = async(req, res) =>{
  try{
    const studentId = req.params.id; //student id 

    // Fetch complaints with nested population
    const complaints = await Complaint.find({ student: studentId }).populate({
      path: "student", // Correct field name for student reference in Complaint schema
      select: "erpid name room", // Select specific fields from Student model
      populate: {
        path: "room", // Populate room field in the Student model
        select: "roomNumber", // Select specific fields from Room model
      },
    });
    // Check if no complaints were found
    if (complaints.length === 0) {
      return res.json({ success: true, msg: "You haven't registered any complaint" });
    }

    // Return complaints with populated fields
    res.json({ success: true, complaints });
  }catch(err){
    return res.status(505).json({success: false, msg: "Server error"});
  }
}



//satisfied or not satisfied by student
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params; // Complaint ID
    const { action, reason } = req.body; // Action: "satisfied" or "notSatisfied", reason for unsolved
    if (!["satisfied", "notSatisfied"].includes(action)) {
      return res.status(400).json({ success: false, msg: "Invalid action" });
    }
    const updateFields = {};
    if (action === "satisfied") {
      updateFields.notifiedToAdmin = true; // Mark as invisible in interface
      updateFields.resolvedMessage = "Student marked as satisfied.";
    } else if (action === "notSatisfied") {
      if (!reason || reason.trim().length < 10) {
        return res.status(400).json({
          success: false,
          msg: "Reason for dissatisfaction must be at least 10 characters long",
        });
      }
      updateFields.notifiedToAdmin = false;
      updateFields.notSolvedReason = reason;
      // await sendNotificationToSuperAdmin(updatedComplaint._id, reason);
    }
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedComplaint) {
      return res.status(404).json({ success: false, msg: "Complaint not found" });
    }

    if (action === "notSatisfied") {
      // Notify super admin
      await sendNotificationToSuperAdmin(updatedComplaint._id, reason);
    }
    
    res.json({ success: true, msg: "Complaint updated successfully", updatedComplaint });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

const sendNotificationToSuperAdmin = async (complaintId, reason) => {
  try {
    console.log(
      `Notification to Super Admin: Complaint ${complaintId} marked as unsatisfied. Reason: ${reason}`
    );
    // Add integration with email/SMS service
  } catch (err) {
    console.error("Error notifying super admin:", err.message);
  }
};

module.exports = {
  registerComplaint,
  getComplaint,
  solvedComplaints,
  unsolvedComplaint,
  getComplaintByStudent,
  updateComplaintStatus
};
