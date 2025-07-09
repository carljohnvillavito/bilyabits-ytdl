import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import VideoInfo from './VideoInfo';
import FormatSelector from './FormatSelector';
import DownloadButton from './DownloadButton';
import { validateYouTubeUrl, extractVideoId } from '../utils/youtube';

const { FiLink, FiSearch, FiAlertCircle } = FiIcons;

const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call to get video info
      const videoId = extractVideoId(url);
      const mockVideoInfo = {
        id: videoId,
        title: 'Sample Video Title - Amazing Content',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: '5:32',
        views: '1,234,567',
        author: 'Content Creator',
        description: 'This is a sample video description that shows what the video is about...',
        uploadDate: '2024-01-15',
        availableFormats: [
          { format: 'mp4', quality: '1080p', size: '150MB' },
          { format: 'mp4', quality: '720p', size: '95MB' },
          { format: 'mp4', quality: '480p', size: '65MB' },
          { format: 'webm', quality: '720p', size: '85MB' },
          { format: 'mp3', quality: '320kbps', size: '12MB' },
        ]
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setVideoInfo(mockVideoInfo);
    } catch (err) {
      setError('Failed to fetch video information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;
    
    // In a real implementation, this would trigger the download
    // For demo purposes, we'll show a success message
    alert(`Download started for ${videoInfo.title} in ${selectedFormat.toUpperCase()} format (${selectedQuality})`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Download YouTube Videos
        </h2>
        <p className="text-gray-400 text-lg">
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
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL here..."
            className="w-full pl-12 pr-32 py-4 bg-dark-700/50 backdrop-blur-sm border border-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          />
          <motion.button
            type="submit"
            disabled={loading || !url}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
              className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2 text-red-400"
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
            
            <div className="grid md:grid-cols-2 gap-6">
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
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoDownloader;