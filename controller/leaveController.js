const { validationResult } = require("express-validator");
const Leave = require("../models/Leave");

const leaveRequest = async (req, res) =>{
      success = false
      const errors = validationResult(req);
      if(!errors.isEmpty()){
            return res.status(200).json({success, errors:errors.array()});
      }
      const {erpid, student,roomNumber, hostel, parentName, parentNumber, title, reason} = req.body;

      try{
            const studentRecord = await User.findOne({ erpid });
            if (!studentRecord) {
              return res.status(404).json({ success, msg: "Student not found" });
            }

            const newLeave = new Leave({
                  erpid,
                  student : studentRecord._id,
                  roomNumber,
                  hostel,
                  parentName,
                  parentNumber,
                  title,
                  reason
            })

            await newLeave.save();

            studentRecord.leaves.push(newLeave._id);
            await studentRecord.save();
            success = true;
            res.status(400).json({success, msg: "leave application submitted successfull"});

      }catch(err){
            console.log(err);
            res.status(500).send("server error");
      }
}


const approveLeave = async (req, res) => {
      const { leaveId } = req.body;
    
      try {
        const leave = await Leave.findById(leaveId).populate('student');
    
        if (!leave) {
          return res.status(404).json({ success: false, msg: "Leave request not found" });
        }
    
        if (leave.status !== 'Pending') {
          return res.status(400).json({ success: false, msg: "Leave request already processed" });
        }
    
        leave.status = 'Approved';
        leave.approvalDate = new Date();
        
        const qrCodeData = `${leave.student.erpid}-${leave.approvalDate.getTime()}`;
        const qrCode = await QRCode.toDataURL(qrCodeData);
    
      //   leave.qrCode = qrCode;
      //   await leave.save();
    
        res.status(200).json({ success: true, msg: "Leave approved and QR code generated", qrCode });
        console.log(qrCode)
    
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    };
    
    const getLeaveDetails = async (req, res) => {
      const { erpid } = req.params;
    
      try {
        const student = await User.findOne({ erpid }).populate('leaves');
    
        if (!student) {
          return res.status(404).json({ success: false, msg: "Student not found" });
        }
    
        res.status(200).json({ success: true, leaves: student.leaves });
    
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    };
    
    
    

module.exports = {
      leaveRequest,
      approveLeave,
      getLeaveDetails
}