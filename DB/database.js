const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const connectDatabase = () =>{
      mongoose.connect(process.env.Database_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
      }).then(() =>{
            console.log("mongodb connected");
      })
}

module.exports = connectDatabase;