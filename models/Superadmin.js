const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const superAdminSchema = new Schema({
      name:{
            type: String,
      },
      erpid:{
            type: Number,
            required: true,
      },
      password:{
            type: String,
            required: true,
      },role:{
            type: String,
            required: true,
            default: "SuperAdmin",
      }
})

const admin = mongoose.model("SuperAdmin", superAdminSchema);
module.exports = admin;