const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
  hostel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  
  students: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    },
  ],
  capacity: {
      type: Number,
      required: true,
      default: 4, // Set default value for capacity
    },
});

// Custom validator to ensure the maximum length of the students array is 4
roomsSchema.path('students').validate(function (value) {
  return value.length <= this.capacity; // Compare with capacity field
}, 'Maximum length of students array exceeds the defined capacity.');

const Room = mongoose.model('Room', roomsSchema);
module.exports = Room;
