const express = require("express");
const app = express();
const connectDatabase = require('../DB/database');
const cors = require('cors');
const bodyParser = require('body-parser'); // Add body-parser
const port = 7000; 
connectDatabase();

//route for apis
const studentRoutes = require("../routes/student")
const authRouter = require("../routes/authRoutes")
const request = require("../routes/requestRoutes")
const complaint = require("../routes/complaintRoutes")
const leave = require("../routes/leaveRoutes")
const hostels = require("../routes/hostelRoutes")
const attendance = require("../routes/attendanceRouter")
// const adminRoutes = require("../routes/adminRoutes")
const rooms = require("../routes/roomsRoutes")

// Add body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// Add cors middleware
app.use(cors());
app.use(express.json());

//make apis
app.use("/api/register", studentRoutes);
app.use("/api/auth", authRouter)
app.use("/api/request", request);
app.use("/api/complaint", complaint);
app.use("/api/leave", leave);
app.use("/api/hostel", hostels)
app.use("/api/attendance", attendance)
// app.use("/api/admin", adminRoutes)
app.use("/api/rooms", rooms)



app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
