import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import School from "./models/school.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ========================
// 📊 API ROUTES
// ========================

// Get all schools (limit 50)

app.get("/api/schools", async (req, res) => {
  try {
    const schools = await School.find().limit(50);
    console.log(`✅ Found ${schools.length} schools`);
    res.json(schools);
  } catch (err) {
    console.error("❌ Error fetching schools:", err);
    res.status(500).json({
      error: "Server Error",
      message: err.message,
      stack: err.stack,
    });
  }
});


// Get schools by district
app.get("/api/schools/district/:district", async (req, res) => {
  try {
    const { district } = req.params;
    const schools = await School.find({ district }).sort({ "streams.tenth.passPercentage": -1 });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Get schools by stream
app.get("/api/schools/stream/:stream", async (req, res) => {
  try {
    const { stream } = req.params;
    const query = {};
    query[`streams.${stream}`] = { $ne: null };
    const schools = await School.find(query).sort({ [`streams.${stream}.passPercentage`]: -1 });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Combined: district + stream
app.get("/api/schools/:district/:stream", async (req, res) => {
  try {
    const { district, stream } = req.params;
    const query = { district };
    query[`streams.${stream}`] = { $ne: null };
    const schools = await School.find(query).sort({ [`streams.${stream}.passPercentage`]: -1 });
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
