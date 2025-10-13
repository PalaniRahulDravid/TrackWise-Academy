const mongoose = require("mongoose");

const RoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["domain", "branch"], required: true },
  inputFields: { type: mongoose.Schema.Types.Mixed, required: true },
  roadmapText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Roadmap", RoadmapSchema);