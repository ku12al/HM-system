const Complaint = require("../models/Complaint");

const getAllComplaint = async (req, res) => {
  try {
    // Filter to show only unsolved complaints
    const filter = { status: "unsolved" };

    const complaints = await Complaint.aggregate([
      { $match: filter }, // Match complaints with status "unsolved"
      { $sort: { date: -1 } }, // Sort by most recent date
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
      { $unwind: "$studentDetails" }, // Deconstruct studentDetails array
      {
        $project: {
          _id: 1,
          type: 1,
          description: 1,
          status: 1,
          date: 1,
          "studentDetails.name": 1,
          "studentDetails.room_no": 1,
        },
      },
    ]);

    res.json({ success: true, complaints });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  getAllComplaint,
};
