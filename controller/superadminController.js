const express = require('express');


//get all leaves applications


//get all attendence of students


//get all red cases of students

//get all outing information for students



const getAllComplaints = async(req, res) =>{
      try{

      }catch(err){
            return res.status(500).json({success: false, msg: "server error"})
      }
}

module.exports = {
      getAllComplaints,

}