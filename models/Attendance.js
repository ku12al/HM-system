const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave"],
    default: "Absent",
  },
  markedManually: { type: Boolean, default: false },
  // leaveReason: { type: String, default: "" }, // Optional field for leave reason
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
