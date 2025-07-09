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

const { FiLink, FiSearch, FiAlertCircle, FiClipboard, FiX } = FiIcons;

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

  const handleClearUrl = () => {
    setUrl('');
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
      
      // Perform the actual download
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
        className="text-center mb-6 md:mb-10"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4">
          Download YouTube Videos
        </h2>
        <p className="text-gray-400 text-sm md:text-lg">
          Paste a YouTube URL and download videos in your preferred format
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleUrlSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6 md:mb-8"
      >
        {/* Mobile-optimized input with improved spacing */}
        <div className="relative flex items-center mb-2">
          <div className="absolute left-3 text-gray-400 z-10">
            <SafeIcon icon={FiLink} className="text-lg" />
          </div>
          
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full pl-10 pr-10 py-3.5 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all duration-300 text-sm"
          />
          
          {url && (
            <button
              type="button"
              onClick={handleClearUrl}
              className="absolute right-3 text-gray-400 hover:text-white"
            >
              <SafeIcon icon={FiX} className="text-lg" />
            </button>
          )}
        </div>
        
        <div className="flex gap-2 mb-4">
          <motion.button
            type="button"
            onClick={handlePaste}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-gray-300 py-3 rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2 text-sm font-medium"
          >
            <SafeIcon icon={FiClipboard} className="text-base" />
            <span>Paste URL</span>
          </motion.button>
          
          <motion.button
            type="submit"
            disabled={loading || !url}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
              className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-400 text-sm"
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
            className="space-y-4 md:space-y-6"
          >
            <VideoInfo videoInfo={videoInfo} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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