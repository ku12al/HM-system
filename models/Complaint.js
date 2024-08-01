const mongoose = require('mongoose');
const Schema = mongoose.Schema

const complaintSchema = new Schema({
      student:{
            type:Schema.Types.ObjectId,
            ref:'Student'
      },
      hostel:{
            type:Schema.Types.ObjectId,
            ref:'Hostel'
      },
      room_no:{
            type:Schema.Types.ObjectId,
            ref:'Room'
      },
      type:{
            type:String,
            required:true
      },
      description:{
            type:String,
            required:true
      },
      status:{
            type:String,
            default:'pending'
      },
      date:{
            type:Date,
            default:Date.now()
      }

})

module.exports = Complaint = mongoose.model('complaint', complaintSchema)

