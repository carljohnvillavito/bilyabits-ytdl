import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Validate YouTube URL
export const validateYouTubeUrl = (url) => {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/(www\.)?youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/v\/[\w-]+/
  ];
  return patterns.some(pattern => pattern.test(url));
};

// Extract video ID from YouTube URL
export const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

// Format duration from seconds
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Format file size from bytes
export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return "Unknown";
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)}${units[unitIndex]}`;
};

// Get video information from our backend API
export const getVideoInfo = async (videoId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/video-info/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video info:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Video not found. Please check the URL and try again.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error('Failed to fetch video information. Please check your connection and try again.');
    }
  }
};

// Download video file
export const downloadVideo = async (videoInfo, format, quality) => {
  if (!videoInfo) throw new Error('No video information available');
  
  try {
    // Find the selected format
    const selectedFormat = videoInfo.availableFormats.find(
      f => f.format === format && f.quality === quality
    );
    
    if (!selectedFormat) {
      throw new Error('Selected format not available');
    }
    
    // Make download request to our backend
    const response = await axios.post(`${API_BASE_URL}/download`, {
      videoId: videoInfo.id,
      format: format,
      quality: quality,
      itag: selectedFormat.itag
    }, {
      responseType: 'blob',
      timeout: 300000, // 5 minutes timeout
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Download progress: ${percentCompleted}%`);
        }
      }
    });
    
    // Create blob URL and trigger download
    const blob = new Blob([response.data], { 
      type: format === 'mp3' ? 'audio/mpeg' : `video/${format}` 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${videoInfo.title.replace(/[^\w\s]/gi, '')}_${quality}.${format}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    window.URL.revokeObjectURL(url);
    
    return {
      videoId: videoInfo.id,
      title: videoInfo.title,
      format,
      quality,
      size: selectedFormat.size,
    };
  } catch (error) {
    console.error('Download error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Download timeout. Please try again.');
    } else if (error.response?.status === 404) {
      throw new Error('Video format not available for download.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error during download. Please try again.');
    } else {
      throw new Error(`Download failed: ${error.message}`);
    }
  }
};