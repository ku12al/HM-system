const mongoose = require('mongoose')
const Schema = mongoose.Schema

const leaveSchema = new Schema({
      student:{
            type:Schema.Types.ObjectId,
            ref:'student'
      },
      hostel:{
            type:Schema.Types.ObjectId,
            ref:'hostel'
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
            default:'pending'
      },
      date:{
            type:Date,
            default: Date.now()
      }


})

module.exports = Leave = mongoose.model('leave', leaveSchema);