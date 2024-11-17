const mongoose = require('mongoose');
const Schema = mongoose.Schema
const studentSchema = new Schema({
      name:{
            type: String,
            required: true
      },
      erpid:{
            type: Number,
            required: true,
            unique:true
      },
      gender:{
            type:String,
            required:true
      },
      email:{
            type: String,
            required: true
      },
      phone:{
            type: Number,
            required:true,
      },
      year:{
            type:String,
            required:true
      },
      dept:{
            type:String,
            required:true
      },
      course:{
            type:String,
            required:true
      },
      father_name:{
            type:String,
            required:true
      },
      address:{
            type:String,
            required:true
      },
      dob:{
            type:String,
            required:true
      },
      user:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required: true
      },
      hostel:{
            type:Schema.Types.ObjectId,
            ref:'Hostel',
            required: true
      },
      room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
            required: true
      },
      qrCode:{
            type:String,
            required: true,
      },
      role: {
            type: String,
            default: "User"
      },
      createdAt: {
            type: Date,
            default: Date.now(),
      },
})

const Student = mongoose.model("Student", studentSchema);

module.exports = Student