const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
      hostelname:{
            type:String,
            required:true
      },
      location:{
            type:String,
            required:true
      },
})

module.exports = Hostel = mongoose.model('hostel', hostelSchema);