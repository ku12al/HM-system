const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  hostelname: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  rooms: [
    {
      room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room',
        // required: true
      }
    }
  ]

});

// Check if the model already exists before defining it
const Hostel = mongoose.model('Hostel', hostelSchema);

module.exports = Hostel;
