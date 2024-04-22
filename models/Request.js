const mongoose = require('mongoose');


const requestSchema = new mongoose.Schema({
      erpid:{
            type:Number,
            required:true,
            unique:true
      },
      date:{
            type:Date,
            default: Date.now()
      }
})

module.exports = Request = mongoose.model('request', requestSchema);