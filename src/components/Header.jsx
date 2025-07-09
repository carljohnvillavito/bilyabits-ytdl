import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiYoutube } = FiIcons;

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-700/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <SafeIcon 
                icon={FiDownload} 
                className="text-2xl text-primary-500" 
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              YouTube Downloader
            </h1>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <SafeIcon icon={FiYoutube} className="text-primary-500" />
            <span className="text-sm">Download videos in HD quality</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;