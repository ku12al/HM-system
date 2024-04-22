const mongoose = require('mongoose');


const roomsSchema = new mongoose.Schema({
      hostel:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'hostel',
            require:true,
      },
      roomNumber:{
            type: String,
            required: true
      },
      capacity:{
            type: Number,
            required:true
      },
      students:[
            {
                  student:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:'student'
                  }
            }
      ]
});

// Custom validator to ensure the maximum length of the students array is 4
roomsSchema.path('students').validate(function (value) {
      return value.length <= 4;
    }, 'Maximum length of students array is 4');

module.exports = Room = mongoose.model("room", roomsSchema);