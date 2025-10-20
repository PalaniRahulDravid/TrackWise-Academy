const axios = require('axios');
const API_KEY = process.env.YOUTUBE_API_KEY;

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';

exports.searchYouTube = async (query, maxResults = 10) => {
  // Search for videos and playlists (type can be 'video' or 'playlist')
  const params = {
    key: API_KEY,
    part: 'snippet',
    q: query,
    maxResults,
    type: 'video', // or 'playlist' as needed.
  };
  const { data } = await axios.get(YOUTUBE_SEARCH_URL, { params });

  // Now fetch video statistics for those IDs
  const videoIds = data.items.map(item => item.id.videoId).filter(Boolean);
  let stats = [];
  if (videoIds.length) {
    const statParams = {
      key: API_KEY,
      part: 'snippet,contentDetails,statistics',
      id: videoIds.join(','),
    };
    const resp = await axios.get(YOUTUBE_VIDEOS_URL, { params: statParams });
    stats = resp.data.items;
  }

  // format each result
  return stats.map(video => ({
    id: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail: video.snippet.thumbnails.high.url,
    duration: video.contentDetails.duration,
    views: video.statistics.viewCount,
    likes: video.statistics.likeCount,
    channel: video.snippet.channelTitle,
    publishedAt: video.snippet.publishedAt,
    url: `https://www.youtube.com/watch?v=${video.id}`
  }));
};
