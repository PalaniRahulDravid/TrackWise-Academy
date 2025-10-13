const Roadmap = require("../models/Roadmap");
const { generateRoadmap } = require("../utils/groqClient");

// Helper to build prompt
function buildPrompt(type, inputFields) {
  if (type === "domain") {
    return `
      I want to get a complete learning roadmap.
      My Domain: ${inputFields.SelectedDomain}
      My Current Skills: ${inputFields.CurrentSkills}
      Experience Level: ${inputFields.ExperienceLevel}
      Time Availability per day/week: ${inputFields.TimeAvailability}
      Preferred Learning Pace: ${inputFields.PreferredLearningPace}
      My Goals: ${inputFields.YourGoals}
      Please generate a practical step-by-step roadmap.
    `;
  } else {
    return `
      I am a college student from branch: ${inputFields.CollegeBranch}.
      Time Availability: ${inputFields.TimeAvailability}
      Preferred Learning Pace: ${inputFields.PreferredLearningPace}
      My Goals: ${inputFields.YourGoals}
      Based on my branch, please generate a roadmap to learn and grow effectively.
    `;
  }
}

exports.generateRoadmap = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { type, inputFields } = req.body;

    const prompt = buildPrompt(type, inputFields);
    const messages = [{ role: "user", content: prompt }];
    const roadmapText = await generateRoadmap(messages);

    const roadmap = new Roadmap({
      userId,
      type,
      inputFields,
      roadmapText
    });
    await roadmap.save();

    res.status(201).json({ roadmap });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserRoadmaps = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    res.json({ roadmaps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await Roadmap.findById(id);
    if (!roadmap) return res.status(404).json({ error: "Not found" });
    res.setHeader("Content-Disposition", `attachment; filename=roadmap_${id}.txt`);
    res.setHeader("Content-Type", "text/plain");
    res.send(roadmap.roadmapText);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
