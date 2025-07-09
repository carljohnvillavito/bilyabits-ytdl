import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// YouTube Data API configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

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
    
    if (!YOUTUBE_API_KEY) {
      return res.status(500).json({ 
        error: 'YouTube API key not configured' 
      });
    }

    // Fetch video details from YouTube Data API
    const videoResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video data from YouTube API');
    }
    
    const videoData = await videoResponse.json();
    
    if (!videoData.items || videoData.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    const video = videoData.items[0];
    const { snippet, statistics, contentDetails } = video;
    
    // Get available formats using ytdl-core
    let availableFormats = [];
    try {
      const info = await ytdl.getInfo(videoId);
      const formats = ytdl.filterFormats(info.formats, 'audioandvideo');
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      
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
    
    if (!videoId || !format || !quality) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get video info
    const info = await ytdl.getInfo(videoId);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    
    // Set response headers for download
    const filename = `${videoTitle}_${quality}.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    if (format === 'mp3') {
      // For audio downloads
      res.setHeader('Content-Type', 'audio/mpeg');
      
      const audioFormat = ytdl.chooseFormat(info.formats, { 
        quality: 'highestaudio',
        filter: 'audioonly'
      });
      
      if (!audioFormat) {
        return res.status(404).json({ error: 'Audio format not available' });
      }
      
      const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat });
      audioStream.pipe(res);
      
    } else {
      // For video downloads
      res.setHeader('Content-Type', `video/${format}`);
      
      let selectedFormat;
      if (itag) {
        selectedFormat = info.formats.find(f => f.itag === itag);
      } else {
        selectedFormat = ytdl.chooseFormat(info.formats, { 
          quality: quality,
          filter: format === 'mp4' ? 'audioandvideo' : 'videoandaudio'
        });
      }
      
      if (!selectedFormat) {
        return res.status(404).json({ error: 'Video format not available' });
      }
      
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
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    apiKey: !!YOUTUBE_API_KEY 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`YouTube API Key configured: ${!!YOUTUBE_API_KEY}`);
});