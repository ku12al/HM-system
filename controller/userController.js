const bcrypt = require('bcryptjs')
const { generateToken } = require("../utils/auth");
const User = require("../models/User");



//Login for student ----------
const login = async(req, res) => {
  const { erpid, password } = req.body;

  try {
    const user = await User.findOne({ erpid });

    if (!user) {
      return res
        .status(400)
        .json({ success:false, error: [{ message: "user not found" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({success:false, error: [{ message: "user not valid" }] });
    }

    const token = generateToken(user._id, user.isAdmin);
    console.log(token);

    res.status(400).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          erpid: user.erpid,
          isAdmin: user.isAdmin,
        },
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
};


//change password --------
const changePassword = async (req, res) =>{

      const {erpid, password, newPassword} = req.body;
      try{
            const user = await User.findOne({erpid})

            if(!user){
                  res.status(402).json({success:false, errors:[{message:"user Invalid"}]});
            }

            const oldPassword = await bcrypt.compare(password, user.password)
            console.log(oldPassword);

            if(!oldPassword){
                  res.status(400).json({success:false, errors:[{message:"Invalid credintial"}]});
            }

            const sendhanammak = await bcrypt.genSalt(10);
            const newPasswordHash = await bcrypt.hash(newPassword, sendhanammak);

            console.log(newPasswordHash)

            user.password = newPasswordHash;
            await user.save();

            res.status(200).json({success:true, message:"password change successfully"});


      }catch(err){
            console.log(err.message);
            return res.status(500).send('server error');
      }
}


module.exports = {
      login,
      changePassword
}
