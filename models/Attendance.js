const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new mongoose.Schema({
      roomNumber:{
            type:Schema.Types.ObjectId,
            ref:'room',
            required:true,
      },
      student:{
            type:Schema.Types.ObjectId,
            ref:'Student',
      },
      date:{
            type:Date,
            default:Date.now()
      },
      status:{
            type:String,
            required:true,
            default:"absent"
      } 
})

module.exports = Attendance = mongoose.model('attendance', attendanceSchema
)