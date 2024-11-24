
const Request = require("../models/Request");



const requestRegister = async (req, res) => {
      try{
            const {erpid} = req.body;
            
            const request = await Request.findOne({erpid});
            if(request){
                  return res.status(500).json({errors: [{message:"request already exists"}]})
            }
            const newRequest = new Request({
                  erpid
            })
            await newRequest.save();
            res.json(newRequest);

      }catch(error){
            console.log(error.message);
            res.status(500).send("sever credential");
      }
}


const getAll = async (req, res) =>{
      try{
            const request = await Request.find();
            res.json(request);

      }catch(err){
            console.log(err.message);
            res.status(200).send('sever error');
      }
}

module.exports = {
      requestRegister,
      getAll
}