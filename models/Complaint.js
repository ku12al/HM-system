const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const complaintSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student reference is required"],
      index: true, // Index for faster lookups
    },
    hostel: {
      type: Schema.Types.ObjectId,
      ref: "Hostel",
      required: [true, "Hostel reference is required"],
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },
    type: {
      type: String,
      required: [true, "Complaint type is required"],
      minlength: [3, "Complaint type must be at least 3 characters long"],
      maxlength: [50, "Complaint type cannot exceed 50 characters"],
      trim: true, // Remove unnecessary spaces
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Solved", "Unsolved"],
      default: "Pending",
      index: true, // Index for filtering by status
    },
    resolvedMessage: {
      type: String,
      maxlength: [500, "Resolved message cannot exceed 500 characters"],
      trim: true,
    },
    notSolvedReason: {
      type: String,
      maxlength: [500, "Reason for unsolved status cannot exceed 500 characters"],
      trim: true,
    },
    feedback: {
      type: String,
      maxlength: [500, "Feedback cannot exceed 500 characters"],
      trim: true,
    },
    notifiedToAdmin: {
      type: Boolean,
      default: false,
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "Solved", "Unsolved"],
          required: true,
        },
        changedBy: {
          type: Schema.Types.ObjectId,
          ref: "Warden",
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to update statusHistory automatically
complaintSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      changedBy: this._id, // You can adjust this to use the actual user ID
    });
  }
  next();
});

// Export model
const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
