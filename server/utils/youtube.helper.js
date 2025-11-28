require("dotenv").config();
const { google } = require("googleapis");

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_API_KEY,
});
// video at youtube.com/watch?v={id.videoId}

async function getVideos(searchQuery) {
  const res = await youtube.search.list({
    part: "snippet",
    q: searchQuery,
    maxResults: 5,
    type: "video",
  }); 
  const arr = [];
  res.data.items.map((item, idx) => {
    arr.push(`https://www.youtube.com/watch?v=${item.id.videoId}`);
  });
  return arr;
}

module.exports = getVideos;
