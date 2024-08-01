const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      erpid:{
            type:Number,
            required:true,
            unique:true
      },
      password:{
            type:String,
            required:true
      },
      isAdmin:{
            type:Boolean,
            required:true,
      },
      date:{
            type:Date,
            default:Date.now
      }
})

const User = mongoose.model('User', userSchema);

module.exports = User