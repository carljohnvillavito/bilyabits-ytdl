import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parser middleware
app.use(express.json());

// YouTube Data API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send(path.join(__dirname, 'index.html'));
});

// Helper function to format duration from ISO 8601 to readable format
const formatDuration = (isoDuration) => {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
};

// Helper function to format view count
const formatViewCount = (viewCount) => {
  const count = parseInt(viewCount);
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Get video information from YouTube Data API
app.get('/api/video-info/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    console.log(`Fetching info for video ID: ${videoId}`);
    
    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not configured');
      return res.status(500).json({ 
        error: 'YouTube API key not configured' 
      });
    }

    console.log(`Using YouTube API key: ${YOUTUBE_API_KEY.substring(0, 5)}...`);
    
    // Fetch video details from YouTube Data API
    const videoUrl = `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    console.log(`Fetching from YouTube API: ${videoUrl.replace(YOUTUBE_API_KEY, 'API_KEY')}`);
    
    const videoResponse = await fetch(videoUrl);
    
    if (!videoResponse.ok) {
      const errorText = await videoResponse.text();
      console.error('YouTube API error:', errorText);
      throw new Error(`Failed to fetch video data: ${errorText}`);
    }
    
    const videoData = await videoResponse.json();
    console.log('YouTube API response received');
    
    if (!videoData.items || videoData.items.length === 0) {
      console.error('Video not found in API response');
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const video = videoData.items[0];
    const { snippet, statistics, contentDetails } = video;
    
    // Get available formats using ytdl-core
    let availableFormats = [];
    try {
      console.log('Getting video formats with ytdl-core');
      const info = await ytdl.getInfo(videoId);
      console.log(`Found ${info.formats.length} formats`);
      
      const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      
      console.log(`Filtered formats: ${formats.length} video, ${audioFormats.length} audio`);
      
      // Process video formats
      const videoQualities = new Map();
      formats.forEach(format => {
        if (format.container === 'mp4' || format.container === 'webm') {
          const quality = format.qualityLabel || format.quality;
          if (!videoQualities.has(`${format.container}_${quality}`)) {
            videoQualities.set(`${format.container}_${quality}`, {
              format: format.container,
              quality: quality,
              size: formatFileSize(format.contentLength),
              itag: format.itag
            });
          }
        }
      });
      
      // Process audio formats
      const audioQualities = new Map();
      audioFormats.forEach(format => {
        if (format.container === 'mp4' || format.container === 'webm') {
          const quality = format.audioBitrate ? `${format.audioBitrate}kbps` : '128kbps';
          if (!audioQualities.has(`mp3_${quality}`)) {
            audioQualities.set(`mp3_${quality}`, {
              format: 'mp3',
              quality: quality,
              size: formatFileSize(format.contentLength),
              itag: format.itag
            });
          }
        }
      });
      
      availableFormats = [...videoQualities.values(), ...audioQualities.values()];
      console.log(`Final available formats: ${availableFormats.length}`);
    } catch (ytdlError) {
      console.error('YTDL Error:', ytdlError);
      // Fallback formats if ytdl-core fails
      availableFormats = [
        { format: 'mp4', quality: '1080p', size: 'Unknown', itag: null },
        { format: 'mp4', quality: '720p', size: 'Unknown', itag: null },
        { format: 'mp4', quality: '480p', size: 'Unknown', itag: null },
        { format: 'mp4', quality: '360p', size: 'Unknown', itag: null },
        { format: 'webm', quality: '720p', size: 'Unknown', itag: null },
        { format: 'webm', quality: '480p', size: 'Unknown', itag: null },
        { format: 'mp3', quality: '320kbps', size: 'Unknown', itag: null },
        { format: 'mp3', quality: '192kbps', size: 'Unknown', itag: null },
        { format: 'mp3', quality: '128kbps', size: 'Unknown', itag: null }
      ];
      console.log('Using fallback formats');
    }
    
    // Format the response
    const videoInfo = {
      id: videoId,
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url,
      duration: formatDuration(contentDetails.duration),
      views: formatViewCount(statistics.viewCount),
      author: snippet.channelTitle,
      uploadDate: snippet.publishedAt.split('T')[0],
      availableFormats: availableFormats
    };
    
    console.log('Sending video info response');
    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ 
      error: 'Failed to fetch video information',
      details: error.message 
    });
  }
});

// Download video endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { videoId, format, quality, itag } = req.body;
    console.log(`Download request: ${videoId}, ${format}, ${quality}, itag: ${itag}`);
    
    if (!videoId || !format || !quality) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get video info
    console.log('Getting video info');
    const info = await ytdl.getInfo(videoId);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    
    // Set response headers for download
    const filename = `${videoTitle}_${quality}.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    if (format === 'mp3') {
      // For audio downloads
      console.log('Downloading as mp3 audio');
      res.setHeader('Content-Type', 'audio/mpeg');
      
      const audioFormat = ytdl.chooseFormat(info.formats, { 
        quality: 'highestaudio',
        filter: 'audioonly'
      });
      
      if (!audioFormat) {
        return res.status(404).json({ error: 'Audio format not available' });
      }
      
      console.log('Selected audio format:', audioFormat.itag);
      const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat });
      audioStream.pipe(res);
      
    } else {
      // For video downloads
      console.log(`Downloading as ${format} video`);
      res.setHeader('Content-Type', `video/${format}`);
      
      let selectedFormat;
      if (itag) {
        console.log(`Looking for format with itag: ${itag}`);
        selectedFormat = info.formats.find(f => f.itag === parseInt(itag));
      } else {
        console.log(`Choosing format for quality: ${quality}`);
        selectedFormat = ytdl.chooseFormat(info.formats, { 
          quality: quality,
          filter: format === 'mp4' ? 'audioandvideo' : 'videoandaudio'
        });
      }
      
      if (!selectedFormat) {
        console.error('Video format not available');
        return res.status(404).json({ error: 'Video format not available' });
      }
      
      console.log('Selected video format:', selectedFormat.itag);
      const videoStream = ytdl.downloadFromInfo(info, { format: selectedFormat });
      videoStream.pipe(res);
    }
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Download failed',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const apiKeyConfigured = !!YOUTUBE_API_KEY;
  console.log(`Health check. API Key configured: ${apiKeyConfigured}`);
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    apiKey: apiKeyConfigured 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`YouTube API Key configured: ${!!YOUTUBE_API_KEY}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
});
