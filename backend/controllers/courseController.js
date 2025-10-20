const { searchYouTube } = require('../utils/youtubeApi');

exports.youtubeSearch = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Search query required' });
  try {
    const results = await searchYouTube(query);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
