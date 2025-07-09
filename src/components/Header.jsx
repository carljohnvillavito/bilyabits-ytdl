import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiYoutube, FiGithub, FiFacebook } = FiIcons;

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/80 backdrop-blur-sm border-b border-zinc-800/50 sticky top-0 z-50"
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
                className="text-2xl text-red-600" 
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              BILYABITS-ytdl
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-2 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <SafeIcon icon={FiYoutube} className="text-red-600" />
              <span className="text-sm hidden sm:inline">Download videos in HD quality</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.a 
                href="https://github.com/bilyabits/ytdl" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-green-500 transition-colors duration-300"
              >
                <SafeIcon icon={FiGithub} className="text-xl" />
              </motion.a>
              <motion.a 
                href="https://facebook.com/bilyabits" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-green-500 transition-colors duration-300"
              >
                <SafeIcon icon={FiFacebook} className="text-xl" />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;