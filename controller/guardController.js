const QRCodeScanner = require('qr-code-scanner');

const scanQrCode = async (req, res) => {
      try{
            // console.log(imagePath)
            const {imagePath} = req.body;
            if (!imagePath) {
                  return res.status(400).json({ success: false, msg: "Base64 image string required" });
              }
            if (!imagePath || typeof imagePath !== 'string') {
                  return res.status(400).send('Invalid image path.');
              }
            console.log("imagePath")

            // const deCodedData = await decodeQRCode(imagePath);
            console.log("imagePath")


            if(!qrCodes[deCodedData]){
                  qrCodes[deCodedData] = {status : 'active'};
            }

            if(qrCodes[deCodedData].status === 'declined'){
                  return res.send('This QR code is has already been declined and cannot be used again.');
            }


            res.render('details', {qrCodeData : deCodedData});
      }catch(error){
            console.log(error)
            res.status(500).json({success: false, msg: "server error"});
      }

}


const requestAccept = async (req, res) => {
     try{
      const {qrCodeData} = req.body;

      if(qrCodes[qrCodeData]?.status === 'active'){
            qrCodes[qrCodeData].status = 'approved';
            return res.status(200).send("Outing Request Approved");
      }
      res.send("QR code is not active or has already been processed.")

     }catch(err){
      res.status(500).json({success: false, msg: "server error"});
     }
}


const requestDecline = async (req, res) => {
      try{
            const {qrCodeData} = req.body;

            if(qrCodes[qrCodeData]?.status === 'active'){
                  qrCodes[qrCodeData].status = 'decline';
                  return res.status(200).send("Outing Request Not Approved");
            }
            res.send("QR code is not active or has already been processed.");

      }catch(err){
            return res.status(500).json({success: false, msg: "server error"});
      }
}

module.exports = {
      scanQrCode,
      requestAccept,
      requestDecline
}
