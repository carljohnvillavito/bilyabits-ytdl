import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiCheck, FiArrowDown } = FiIcons;

const DownloadButton = ({ 
  onDownload, 
  selectedFormat, 
  selectedQuality, 
  videoTitle, 
  downloadStatus = { isDownloading: false, progress: 0, complete: false }
}) => {
  const { isDownloading, progress, complete } = downloadStatus;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-4 md:p-6 hover:border-red-600/30 transition-all duration-300"
    >
      <div className="flex items-center space-x-2 mb-4 md:mb-6">
        <SafeIcon icon={FiDownload} className="text-lg md:text-xl text-red-600" />
        <h3 className="text-lg md:text-xl font-bold text-white">Download</h3>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        <div className="bg-zinc-800/50 rounded-lg p-3 md:p-4">
          <h4 className="font-medium text-sm md:text-base text-white mb-2">Download Summary</h4>
          <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-400">
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
              <span className="text-white font-medium truncate max-w-[150px] md:max-w-[200px]">
                {videoTitle}
              </span>
            </div>
          </div>
        </div>
        
        {isDownloading && (
          <div className="w-full bg-zinc-800 rounded-full h-2 md:h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-700 h-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
        
        <motion.button
          onClick={onDownload}
          disabled={isDownloading || complete}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 flex items-center justify-center space-x-2 md:space-x-3 ${
            complete
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : isDownloading
              ? 'bg-zinc-700 cursor-not-allowed text-gray-300'
              : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/25'
          }`}
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-white"></div>
              <span>{Math.round(progress)}% Downloading...</span>
            </>
          ) : complete ? (
            <>
              <SafeIcon icon={FiCheck} className="text-lg md:text-xl" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiArrowDown} className="text-lg md:text-xl" />
              <span>Download Video</span>
            </>
          )}
        </motion.button>
        
        <p className="text-[10px] md:text-xs text-gray-500 text-center">
          By downloading, you agree to respect copyright laws and terms of service
        </p>
      </div>
    </motion.div>
  );
};

export default DownloadButton;