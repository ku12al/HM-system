const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
      erpid: {
            type: String, // Change to String if erpid may contain leading zeros
            required: true
      },
      student: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
      },
      roomNumber: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
      },
      hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel'
      },
      parentName: {
            type: String,
            required: true // Uncomment if required
      },
      parentNumber: {
            type: Number,
            required: true // Uncomment if required
      },
      title: {
            type: String,
            required: true
      },
      reason: {
            type: String,
            required: true
      },
      status: {
            type: String,
            enum: ["Pending", "Approved", "Decline", "OutingRequest"],
            default: "Pending"
      },
      leaveDate: {
            type: Date,
            required: true
      },
      leaveTime: {
            type: String,
            required: true // Ensure consistency in format
      },
      returnDate: {
            type: Date
      },
      returnTime: {
            type: String
      },
      qrcode: {
            type: String
      },
      requestDate: {
            type: Date,
            default: Date.now // Corrected
      },
      approvalDate: Date
});

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
