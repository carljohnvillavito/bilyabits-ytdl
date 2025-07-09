import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import VideoInfo from './VideoInfo';
import FormatSelector from './FormatSelector';
import DownloadButton from './DownloadButton';
import { 
  validateYouTubeUrl, 
  extractVideoId, 
  getVideoInfo, 
  downloadVideo 
} from '../utils/youtube';

const { FiLink, FiSearch, FiAlertCircle, FiClipboard } = FiIcons;

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadStatus, setDownloadStatus] = useState({
    isDownloading: false,
    progress: 0,
    complete: false
  });

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    setVideoInfo(null); // Clear previous video info
    
    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Could not extract video ID from URL');
      }
      
      const info = await getVideoInfo(videoId);
      setVideoInfo(info);
      
      // Set default quality based on available formats
      if (info.availableFormats.length > 0) {
        // Find a 720p format if available, otherwise use the first format
        const defaultFormat = info.availableFormats.find(f => f.format === 'mp4' && f.quality === '720p') 
          || info.availableFormats[0];
        
        setSelectedFormat(defaultFormat.format);
        setSelectedQuality(defaultFormat.quality);
      }
    } catch (err) {
      console.error('Error fetching video info:', err);
      setError('Failed to fetch video information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError('Failed to access clipboard. Please paste the URL manually.');
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;
    
    setDownloadStatus({
      isDownloading: true,
      progress: 0,
      complete: false
    });
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setDownloadStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 15, 99)
        }));
      }, 300);
      
      // Perform the download
      const result = await downloadVideo(videoInfo, selectedFormat, selectedQuality);
      
      clearInterval(progressInterval);
      
      // Complete the download
      setDownloadStatus({
        isDownloading: false,
        progress: 100,
        complete: true
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setDownloadStatus({
          isDownloading: false,
          progress: 0,
          complete: false
        });
      }, 3000);
      
      // In a real app, this would trigger the actual file download
      console.log('Download completed:', result);
    } catch (err) {
      console.error('Download error:', err);
      setError(`Download failed: ${err.message}`);
      setDownloadStatus({
        isDownloading: false,
        progress: 0,
        complete: false
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 md:mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
          Download YouTube Videos
        </h2>
        <p className="text-gray-400 text-base md:text-lg">
          Paste a YouTube URL and download videos in your preferred format and quality
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleUrlSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SafeIcon icon={FiLink} className="text-xl" />
          </div>
          
          {/* Mobile-optimized input with improved spacing */}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full pl-12 pr-[120px] py-3 md:py-4 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-sm md:text-base"
          />
          
          {/* Fixed button positioning to prevent overlap */}
          <div className="absolute right-[92px] top-1/2 transform -translate-y-1/2">
            <motion.button
              type="button"
              onClick={handlePaste}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-colors duration-300 flex items-center space-x-1 text-xs md:text-sm"
            >
              <SafeIcon icon={FiClipboard} className="text-sm md:text-base" />
              <span className="hidden xs:inline">Paste</span>
            </motion.button>
          </div>
          
          <motion.button
            type="submit"
            disabled={loading || !url}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 md:px-6 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 md:space-x-2 text-xs md:text-sm"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <SafeIcon icon={FiSearch} />
                <span>Analyze</span>
              </>
            )}
          </motion.button>
        </div>
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-400 text-sm"
            >
              <SafeIcon icon={FiAlertCircle} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      <AnimatePresence>
        {videoInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <VideoInfo videoInfo={videoInfo} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormatSelector
                selectedFormat={selectedFormat}
                selectedQuality={selectedQuality}
                onFormatChange={setSelectedFormat}
                onQualityChange={setSelectedQuality}
                availableFormats={videoInfo.availableFormats}
              />
              
              <DownloadButton
                onDownload={handleDownload}
                selectedFormat={selectedFormat}
                selectedQuality={selectedQuality}
                videoTitle={videoInfo.title}
                downloadStatus={downloadStatus}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoDownloader;