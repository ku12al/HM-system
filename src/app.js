const express = require("express");
const app = express();
const connectDatabase = require('../DB/database');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const session = require('express-session');
const dotenv = require('dotenv');
const port = 7000; 

// Connect to the database
connectDatabase();
dotenv.config();

// Import routes
const studentRoutes = require("../routes/student");
const authRouter = require("../routes/authRoutes");
const requestRoutes = require("../routes/requestRoutes");
const complaintRoutes = require("../routes/complaintRoutes");
const leaveRoutes = require("../routes/leaveRoutes");
const hostelRoutes = require("../routes/hostelRoutes");
const attendanceRoutes = require("../routes/attendanceRouter");
const roomRoutes = require("../routes/roomsRoutes");
const wardenRoutes = require("../routes/wardenRoutes");

// Add CORS middleware
app.use(cors());

// Add body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: process.env.JWT_SECRET, // Use a strong, secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure: true for HTTPS in production
}));

// Define routes
app.use("/api/register", studentRoutes);
app.use("/api/auth", authRouter);
app.use("/api/request", requestRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/hostel", hostelRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/warden", wardenRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
