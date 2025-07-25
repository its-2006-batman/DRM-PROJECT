require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Flexible schema to store all form fields
const FormDataSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const FormData = mongoose.model("FormData", FormDataSchema);

// Save form data (from admin form)
app.post("/save-form", async (req, res) => {
  try {
    
    const saved = await FormData.create(req.body);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("❌ Save error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fetch latest saved form data
app.get("/latest", async (req, res) => {
  try {
    const latest = await FormData.findOne().sort({ updatedAt: -1 });
    res.json({ success: true, data: latest });
  } catch (error) {
    console.error("Error fetching latest:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

