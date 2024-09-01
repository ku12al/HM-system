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
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;