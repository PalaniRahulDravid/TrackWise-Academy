const { searchYouTube } = require('../utils/youtubeApi');

exports.youtubeSearch = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ 
      success: false,
      message: 'Search query required' 
    });
  }
  
  // Check if YouTube API key is configured
  if (!process.env.YOUTUBE_API_KEY) {
    console.error('❌ YOUTUBE_API_KEY not configured in .env');
    return res.status(503).json({ 
      success: false,
      message: 'YouTube API not configured. Please add YOUTUBE_API_KEY to backend .env file',
      results: []
    });
  }
  
  try {
    const results = await searchYouTube(query);
    res.json({ 
      success: true,
      results 
    });
  } catch (err) {
    console.error('YouTube API error:', err.message);
    res.status(500).json({ 
      success: false,
      error: err.message,
      results: []
    });
  }
};
