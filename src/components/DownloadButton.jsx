import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiCheck, FiArrowDown } = FiIcons;

const DownloadButton = ({ onDownload, selectedFormat, selectedQuality, videoTitle }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsDownloading(false);
    setDownloadComplete(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setDownloadComplete(false);
    }, 3000);
    
    onDownload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-dark-700/30 backdrop-blur-sm border border-dark-600/50 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300"
    >
      <div className="flex items-center space-x-2 mb-6">
        <SafeIcon icon={FiDownload} className="text-primary-500 text-xl" />
        <h3 className="text-xl font-bold text-white">Download</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-dark-600/50 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Download Summary</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="text-primary-400 font-medium">
                {selectedFormat.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quality:</span>
              <span className="text-primary-400 font-medium">
                {selectedQuality}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Title:</span>
              <span className="text-white font-medium truncate max-w-32">
                {videoTitle}
              </span>
            </div>
          </div>
        </div>
        
        <motion.button
          onClick={handleDownload}
          disabled={isDownloading || downloadComplete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
            downloadComplete
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : isDownloading
              ? 'bg-gray-600 cursor-not-allowed text-gray-300'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg shadow-primary-500/25'
          }`}
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Downloading...</span>
            </>
          ) : downloadComplete ? (
            <>
              <SafeIcon icon={FiCheck} className="text-xl" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiArrowDown} className="text-xl" />
              <span>Download Video</span>
            </>
          )}
        </motion.button>
        
        <p className="text-xs text-gray-500 text-center">
          By downloading, you agree to respect copyright laws and terms of service
        </p>
      </div>
    </motion.div>
  );
};

export default DownloadButton;