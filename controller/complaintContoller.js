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

// const getComplaint = async (req, res) => {
//   try {
//     const complaints = await Complaint.find()
//       .populate({
//         path: "student",
//         select: "erpid hostel room name",
//         populate: { path: "room", select: "roomNumber" }, // Populate room details within student
//       })
//       .populate("hostel", "hostelname") // Populate hostel details
//       .sort({
//         status: {
//           $function: {
//             body: function (status) {
//               return status === "pending" ? 1 : status === "unsolved" ? 2 : 3;
//             },
//             args: ["$status"],
//             lang: "js",
//           },
//         },
//         date: -1, // Then sort by date in descending order
//       });

//     res.json({ success: true, complaints });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };


const getComplaint = async (req, res) => {
  try {
    const complaints = await Complaint.aggregate([
      // Add a field for status priority
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
      // Sort by status priority and date
      { $sort: { statusPriority: 1, date: -1 } },
      // Lookup student details
      {
        $lookup: {
          from: "students", // The collection name for students
          localField: "student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      // Unwind studentDetails array to a single object
      { $unwind: "$studentDetails" },
      // Lookup hostel details
      {
        $lookup: {
          from: "hostels", // The collection name for hostels
          localField: "hostel",
          foreignField: "_id",
          as: "hostelDetails",
        },
      },
      // Unwind hostelDetails array to a single object
      { $unwind: "$hostelDetails" },
      // Project only required fields
      {
        $project: {
          _id: 1,
          type: 1,
          description: 1,
          status: 1,
          date: 1,
          "studentDetails.name": 1,
          "hostelDetails.hostelname": 1,
        },
      },
    ]);

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

const complaintByStudent = async(req, res) =>{
  try{
    const studentId = req.params.id;

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



//satisfied 


//Not satisfied

module.exports = {
  registerComplaint,
  getComplaint,
  getByStudent,
  solvedComplaints,
  unsolvedComplaint,
  complaintByStudent,
};
