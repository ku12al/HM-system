const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true, // Make this field mandatory
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: true, // Add required if all complaints must be tied to a hostel
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    type: {
      type: String,
      required: true,
      minlength: 3, // Minimum length for the type string
      maxlength: 50, // Maximum length for the type string
    },
    description: {
      type: String,
      required: true,
      minlength: 10, // Minimum length for descriptions
      maxlength: 500, // Maximum length for descriptions
    },
    status: {
      type: String,
      enum: ["Pending", "Solved", "Unsolved"], // Define possible statuses
      default: "Pending",
    },
    resolvedMessage: {
      type: String,
      maxlength: 500, // Restrict the length of resolved messages
    },
    notSolvedReason: {
      type: String,
      maxlength: 500, // Restrict the length of the not solved reason
    },
    date: {
      type: Date,
      default: Date.now, // Automatically set to the current date
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
