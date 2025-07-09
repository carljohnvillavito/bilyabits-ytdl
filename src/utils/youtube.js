import axios from 'axios';

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

// Calculate estimated file size based on resolution and duration
export const calculateFileSize = (quality, durationInSeconds, format) => {
  // Bitrates in bits per second for different quality levels
  const videoBitrates = {
    '144p': 100000,    // 100 Kbps
    '240p': 300000,    // 300 Kbps
    '360p': 500000,    // 500 Kbps
    '480p': 1000000,   // 1 Mbps
    '720p': 2500000,   // 2.5 Mbps
    '1080p': 5000000,  // 5 Mbps
    '1440p': 10000000, // 10 Mbps
    '2160p': 20000000, // 20 Mbps
    '320kbps': 320000, // 320 Kbps (audio only)
    '192kbps': 192000, // 192 Kbps (audio only)
    '128kbps': 128000, // 128 Kbps (audio only)
  };

  // Get the appropriate bitrate for the quality
  const bitrate = videoBitrates[quality] || 1000000; // Default to 1 Mbps if quality not found
  
  // For audio-only formats (mp3), we only consider audio bitrate
  const isAudioOnly = format === 'mp3';
  
  // Calculate size in bytes (bitrate * duration in seconds / 8 bits per byte)
  const sizeInBytes = isAudioOnly 
    ? (bitrate * durationInSeconds) / 8 
    : (bitrate * durationInSeconds) / 8;
  
  return formatFileSize(sizeInBytes);
};

// Get video information using YouTube API or scraping
export const getVideoInfo = async (videoId) => {
  try {
    // In a real implementation, you would call your backend API or YouTube Data API
    // For this demo, we'll simulate a response
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    // Generate a random duration between 30 seconds and 15 minutes
    const durationInSeconds = Math.floor(Math.random() * (15 * 60 - 30) + 30);
    const formattedDuration = formatDuration(durationInSeconds);
    
    // Generate random view count
    const viewCount = Math.floor(Math.random() * 10000000);
    const formattedViews = new Intl.NumberFormat().format(viewCount);
    
    // Generate random upload date within the last 2 years
    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);
    const randomTimestamp = twoYearsAgo.getTime() + Math.random() * (today.getTime() - twoYearsAgo.getTime());
    const uploadDate = new Date(randomTimestamp).toISOString().split('T')[0];
    
    // Available formats with calculated sizes based on duration
    const availableFormats = [
      { format: 'mp4', quality: '1080p', size: calculateFileSize('1080p', durationInSeconds, 'mp4') },
      { format: 'mp4', quality: '720p', size: calculateFileSize('720p', durationInSeconds, 'mp4') },
      { format: 'mp4', quality: '480p', size: calculateFileSize('480p', durationInSeconds, 'mp4') },
      { format: 'mp4', quality: '360p', size: calculateFileSize('360p', durationInSeconds, 'mp4') },
      { format: 'webm', quality: '1080p', size: calculateFileSize('1080p', durationInSeconds, 'webm') },
      { format: 'webm', quality: '720p', size: calculateFileSize('720p', durationInSeconds, 'webm') },
      { format: 'webm', quality: '480p', size: calculateFileSize('480p', durationInSeconds, 'webm') },
      { format: 'mp3', quality: '320kbps', size: calculateFileSize('320kbps', durationInSeconds, 'mp3') },
      { format: 'mp3', quality: '192kbps', size: calculateFileSize('192kbps', durationInSeconds, 'mp3') },
      { format: 'mp3', quality: '128kbps', size: calculateFileSize('128kbps', durationInSeconds, 'mp3') },
    ];
    
    // Check if thumbnail exists, if not use a fallback
    const checkThumbnail = async (url) => {
      try {
        const response = await axios.head(url);
        return response.status === 200;
      } catch (error) {
        return false;
      }
    };
    
    const thumbnailExists = await checkThumbnail(thumbnailUrl);
    const finalThumbnailUrl = thumbnailExists 
      ? thumbnailUrl 
      : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    return {
      id: videoId,
      title: `Sample YouTube Video - ${videoId}`,
      thumbnail: finalThumbnailUrl,
      duration: formattedDuration,
      durationInSeconds,
      views: formattedViews,
      author: 'Content Creator',
      description: 'This is a sample video description that would be retrieved from the YouTube API. It contains information about the video content and context.',
      uploadDate,
      availableFormats,
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video information');
  }
};

// Simulate download process
export const downloadVideo = async (videoInfo, format, quality) => {
  if (!videoInfo) throw new Error('No video information available');
  
  // In a real implementation, this would communicate with your backend
  // to handle the actual download process
  
  // For demo purposes, we'll simulate the download process
  return new Promise((resolve, reject) => {
    // Find the selected format
    const selectedFormat = videoInfo.availableFormats.find(
      f => f.format === format && f.quality === quality
    );
    
    if (!selectedFormat) {
      reject(new Error('Selected format not available'));
      return;
    }
    
    // Parse the size to estimate download time (purely for demo)
    const sizeString = selectedFormat.size;
    const sizeValue = parseFloat(sizeString);
    const sizeUnit = sizeString.replace(/[0-9.]/g, '').trim();
    
    // Calculate a fake download time based on size
    let downloadTimeMs = 1000; // Base time 1 second
    
    if (sizeUnit === 'MB') {
      downloadTimeMs += sizeValue * 500; // 500ms per MB
    } else if (sizeUnit === 'GB') {
      downloadTimeMs += sizeValue * 2000; // 2 seconds per GB
    }
    
    // Limit max download time for demo purposes
    downloadTimeMs = Math.min(downloadTimeMs, 5000);
    
    setTimeout(() => {
      resolve({
        videoId: videoInfo.id,
        title: videoInfo.title,
        format,
        quality,
        size: selectedFormat.size,
      });
    }, downloadTimeMs);
  });
};