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
      className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 hover:border-red-600/30 transition-all duration-300"
    >
      <div className="flex items-center space-x-2 mb-6">
        <SafeIcon icon={FiDownload} className="text-red-600 text-xl" />
        <h3 className="text-xl font-bold text-white">Download</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-zinc-800/50 rounded-lg p-4">
          <h4 className="font-medium text-white mb-2">Download Summary</h4>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="text-red-400 font-medium">
                {selectedFormat.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quality:</span>
              <span className="text-red-400 font-medium">
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
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : isDownloading
              ? 'bg-zinc-700 cursor-not-allowed text-gray-300'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/25'
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