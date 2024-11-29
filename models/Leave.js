const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaveSchema = new Schema({
      erpid:{
            type:Number,
            required:true
      },
      student:{
            type:Schema.Types.ObjectId,
            ref:'student'
      },
      roomNumber:{
            type:Schema.Types.ObjectId,
            ref:'room'
      },
      hostel:{
            type:Schema.Types.ObjectId,
            ref:'hostel'
      },
      parentName:{
            type:String,
            required:true
      },
      parentNumber:{
            type:Number,
            required:true,

      },
      title:{
            type:String,
            required:true
      },
      reason:{
            type:String,
            required:true
      },
      status:{
            type:String,
            enum:'pending' || 'approved' || 'decline'
      },
      leaveDate: {
            type: Date, 
            required: true 
      }, // Date when the student goes out
      leaveTime: { type: String, required: true }, // Leave time as a string
      returnDate: { 
            type: Date 
      }, // Optional: Date when the student is expected to return
      returnTime: { type: String }, // Optional return time
      qrcode:{
            type:String,
      },
      requestDate:{
            type:Date,
            default: Date.now()
      },
      approvalDate: Date
})

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;