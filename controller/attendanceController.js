// const cron = require("node-cron");
// const moment = require("moment");
// const Student = require("../models/Student");
// const Attendance = require("../models/Attendance");


// //mark student present
// const markPresent = async (req, res) => {
//   const today = new Date();
  
//   // Set the start of the day at 12:00 PM (midday)
//   today.setHours(12, 0, 0, 0);

//   // End of the attendance day at 11:59:59 AM of the next day
//   const endOfDay = new Date(today);
//   endOfDay.setDate(endOfDay.getDate() + 1); // Move to the next day
//   endOfDay.setHours(11, 59, 59, 999);  // Set to 11:59 AM of the next day

//   try {
//     // Verify the QR code and get the student info
//     const { erpid } = req.body;
//     const student = await Student.findOne({ erpid });  // Use findOne for erpid
//     if (!student) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Student not found" });
//     }

//     // Check if the student already has attendance marked for today (from 12 PM to 12 PM)
//     const existingAttendance = await Attendance.findOne({
//       student: student._id,
//       date: {
//         $gte: today,
//         $lte: endOfDay
//       }
//     });

//     if (existingAttendance) {
//       return res.status(400).json({
//         success: false,
//         message: "Attendance already marked for this period",
//       });
//     }

//     // Mark attendance as present
//     const attendance = new Attendance({
//       student: student._id,  // Use student's ID reference here
//       status: "Present",
//       date: new Date(),
//     });
//     await attendance.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Attendance marked as present" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// //mark student absent
// const markAbsent = async () => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Set to the start of the day

//     const students = await Student.find({}); // Get all students

//     for (const student of students) {
//       // Check if attendance for today has already been marked
//       const attendance = await Attendance.findOne({
//         student: student._id,
//         date: today,
//       });

//       if (!attendance) {
//         // If not marked, create an attendance record with Absent status
//         const absentRecord = new Attendance({
//           student: student._id,
//           date: today,
//           status: "Absent", // Mark as Absent
//           markedManually: false, // Set as automatically marked
//         });
//         await absentRecord.save();
//       }
//     }
//     console.log("Absentee records updated successfully.");
//   } catch (error) {
//     console.error("Error marking absentees:", error);
//   }
// };



// //this code for check all student attendence

// const checkAttendance = async (req, res) => {
//   try {
//     const today = new Date();
    
//     // Set start of the attendance day at 12:00 PM (midday)
//     today.setHours(12, 0, 0, 0);

//     // End of the attendance day at 11:59:59 AM of the next day
//     const endOfDay = new Date(today);
//     endOfDay.setDate(endOfDay.getDate() + 1);  // Move to the next day
//     endOfDay.setHours(11, 59, 59, 999);  // Set to 11:59 AM of the next day

//     // Fetch all students
//     const allStudents = await Student.find({});

//     // Fetch attendance records for the custom date range
//     const attendanceRecords = await Attendance.find({
//       date: {
//         $gte: today,
//         $lte: endOfDay,
//       }
//     });

//     // Map attendance status for each student
//     const studentAttendance = allStudents.map(student => {
//       const attendance = attendanceRecords.find(record => 
//         record.student.toString() === student._id.toString()
//       );
      
//       return {
//         student: student,  // Student details
//         status: attendance ? attendance.status : "Absent",  // Attendance status
//         date: attendance ? attendance.date : null  // Attendance date if present
//       };
//     });

//     res.status(200).json({ success: true, records: studentAttendance });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// const checkAttendanceAtDate = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     // Parse the date range provided
//     const start = new Date(startDate); // startDate in format 'YYYY-MM-DD'
//     start.setHours(12, 0, 0, 0);  // Set start of day at 12:00 PM

//     const end = new Date(endDate);  // endDate in format 'YYYY-MM-DD'
//     end.setDate(end.getDate() + 1);  // End of day to next day at 11:59 AM
//     end.setHours(11, 59, 59, 999);

//     // Fetch all students
//     const allStudents = await Student.find({});

//     // Fetch attendance records within the date range
//     const attendanceRecords = await Attendance.find({
//       date: {
//         $gte: start,
//         $lte: end,
//       },
//     });

//     // Map attendance status for each student in the specified range
//     const studentAttendance = allStudents.map(student => {
//       const attendanceRecord = attendanceRecords.find(record => record.student.toString() === student._id.toString());

//       return {
//         student: student,  // Student details
//         status: attendanceRecord ? attendanceRecord.status : "Absent",  // Status if present, else 'Absent'
//         date: attendanceRecord ? attendanceRecord.date : null,  // Attendance date if present
//       };
//     });

//     res.status(200).json({ success: true, records: studentAttendance });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// // Function to mark absent students
// const markAbsentStudents = async () => {
//   const currentDate = moment().startOf("day");

//   // Get all students
//   const students = await Student.find();

//   for (const student of students) {
//     // Check if attendance record exists for today
//     const attendanceRecord = await Attendance.findOne({
//       student: student._id,
//       date: currentDate.toDate(),
//     });

//     if (!attendanceRecord) {
//       // If no attendance record found, mark as absent
//       await markAbsent(student._id);
//     }
//   }
// };

// // Schedule job to run every day at a specific time (e.g., 6 PM)
// cron.schedule("0 18 * * *", () => {
//   console.log("Checking for absent students...");
//   markAbsentStudents();
// });

// module.exports = {
//   markPresent,
//   markAbsent,
//   checkAttendance,
//   checkAttendanceAtDate,
// };

const cron = require("node-cron");
const moment = require("moment");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// Utility: Get Attendance Date Range
const getAttendanceDateRange = (startDate, endDate) => {
  const start = moment(startDate).startOf("day").add(12, "hours").toDate(); // Start at 12 PM
  const end = moment(endDate).endOf("day").add(12, "hours").subtract(1, "second").toDate(); // End at 11:59 AM next day
  return { start, end };
};

// Mark Student Present
const markPresent = async (req, res) => {
  try {
    const { erpid } = req.body;
    if (!erpid) {
      return res.status(400).json({ success: false, message: "ERPID is required" });
    }

    const student = await Student.findOne({ erpid });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const { start, end } = getAttendanceDateRange(new Date(), new Date());

    const existingAttendance = await Attendance.findOne({
      student: student._id,
      date: { $gte: start, $lte: end },
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this period",
      });
    }

    const attendance = new Attendance({
      student: student._id,
      status: "Present",
      date: new Date(),
    });
    await attendance.save();

    res.status(200).json({ success: true, message: "Attendance marked as present" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to mark attendance" });
  }
};

// Mark Absent Students
const markAbsent = async () => {
  try {
    const { start, end } = getAttendanceDateRange(new Date(), new Date());

    const absentStudents = await Student.find({
      _id: {
        $nin: (await Attendance.find({ date: { $gte: start, $lte: end } }).select("student")).map(
          (attendance) => attendance.student
        ),
      },
    });

    const absentRecords = absentStudents.map((student) => ({
      student: student._id,
      date: start,
      status: "Absent",
      markedManually: false,
    }));

    if (absentRecords.length) {
      await Attendance.insertMany(absentRecords);
    }

    console.log(`${absentRecords.length} students marked absent.`);
  } catch (error) {
    console.error("Error marking absentees:", error);
  }
};

// Check Attendance for the Current Day
const checkAttendance = async (req, res) => {
  try {
    const { start, end } = getAttendanceDateRange(new Date(), new Date());

    const attendanceRecords = await Attendance.find({ date: { $gte: start, $lte: end } }).populate("student");
    const allStudents = await Student.find({});

    const studentAttendance = allStudents.map((student) => {
      const record = attendanceRecords.find((rec) => rec.student._id.equals(student._id));
      return {
        student,
        status: record ? record.status : "Absent",
        date: record ? record.date : null,
      };
    });

    res.status(200).json({ success: true, records: studentAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance" });
  }
};

// Check Attendance for a Custom Date Range
const checkAttendanceAtDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start and end dates are required" });
    }

    const { start, end } = getAttendanceDateRange(startDate, endDate);

    const attendanceRecords = await Attendance.find({ date: { $gte: start, $lte: end } }).populate("student");
    const allStudents = await Student.find({});

    const studentAttendance = allStudents.map((student) => {
      const record = attendanceRecords.find((rec) => rec.student._id.equals(student._id));
      return {
        student,
        status: record ? record.status : "Absent",
        date: record ? record.date : null,
      };
    });

    res.status(200).json({ success: true, records: studentAttendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch attendance" });
  }
};

// Schedule Cron Job for Marking Absent Students at 6 PM Daily
cron.schedule("0 18 * * *", async () => {
  console.log("Checking for absent students...");
  await markAbsent();
});

module.exports = {
  markPresent,
  markAbsent,
  checkAttendance,
  checkAttendanceAtDate,
};

