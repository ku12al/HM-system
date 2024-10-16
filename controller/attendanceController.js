const cron = require("node-cron");
const moment = require("moment");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

const markPresent = async (req, res) => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(11, 59, 59, 999);

  try {
    // Verify the QR code and get the student info
    const { erpid } = req.body;
    const student = await Student.findById(erpid);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Mark attendance as present
    const attendance = new Attendance({
      student: erpid,
      status: "Present",
      date: new Date(),
    });
    await attendance.save();

    res
      .status(200)
      .json({ success: true, message: "Attendance marked as present" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const markAbsent = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of the day

    const students = await Student.find({}); // Get all students

    for (const student of students) {
      // Check if attendance for today has already been marked
      const attendance = await Attendance.findOne({
        student: student._id,
        date: today,
      });

      if (!attendance) {
        // If not marked, create an attendance record with Absent status
        const absentRecord = new Attendance({
          student: student._id,
          date: today,
          status: "Absent", // Mark as Absent
          markedManually: false, // Set as automatically marked
        });
        await absentRecord.save();
      }
    }
    console.log("Absentee records updated successfully.");
  } catch (error) {
    console.error("Error marking absentees:", error);
  }
};



// API to check attendance status for all students
const checkAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendanceRecords = await Attendance.find({ date: today }).populate('student');
    res.status(200).json({ success: true, records: attendanceRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Function to mark absent students
const markAbsentStudents = async () => {
  const currentDate = moment().startOf("day");

  // Get all students
  const students = await Student.find();

  for (const student of students) {
    // Check if attendance record exists for today
    const attendanceRecord = await Attendance.findOne({
      student: student._id,
      date: currentDate.toDate(),
    });

    if (!attendanceRecord) {
      // If no attendance record found, mark as absent
      await markAbsent(student._id);
    }
  }
};

// Schedule job to run every day at a specific time (e.g., 6 PM)
cron.schedule("0 18 * * *", () => {
  console.log("Checking for absent students...");
  markAbsentStudents();
});

module.exports = {
  markPresent,
  markAbsent,
  checkAttendance,
};
