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
      rooms:[
            {
                  room:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:'room',
                        required:true
                  }
            }
      ],
      capacity:{
            type:Number,
            required:true
      }
})

module.exports = Hostel = mongoose.model('hostel', hostelSchema);