const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const complaintSchema = new Schema({
      student: {
            type: Schema.Types.ObjectId,
            ref: 'Student'
      },
      hostel: {
            type: Schema.Types.ObjectId,
            ref: 'Hostel'
      },
      room: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
      },
      type: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      status: {
            type: String,
            enum: ['pending', 'approved', 'decline'], // Enum should be an array
            default: 'pending'
      },
      resolvedMessage: String,    // Message if the complaint is solved
      notSolvedReason: String,  
      date: {
            type: Date,
            default: Date.now // No parentheses to ensure it's a function call
      }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
