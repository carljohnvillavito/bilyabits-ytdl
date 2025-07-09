import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiShield, FiInfo, FiGithub, FiFacebook } = FiIcons;

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-black/60 backdrop-blur-sm border-t border-zinc-800/50 mt-16"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent">
            BILYABITS-ytdl
          </h2>
          
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <span>Made with</span>
            <SafeIcon icon={FiHeart} className="text-red-600" />
            <span>for YouTube enthusiasts</span>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} className="text-green-500" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiInfo} className="text-red-600" />
              <span>Respect Copyright</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 mt-4">
            <motion.a 
              href="https://github.com/bilyabits/ytdl" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-green-500 transition-colors duration-300"
            >
              <SafeIcon icon={FiGithub} className="text-2xl" />
            </motion.a>
            <motion.a 
              href="https://facebook.com/bilyabits" 
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-red-600 transition-colors duration-300"
            >
              <SafeIcon icon={FiFacebook} className="text-2xl" />
            </motion.a>
          </div>
          
          <p className="text-xs text-gray-600 max-w-2xl mx-auto">
            This tool is for educational purposes only. Please respect YouTube's terms of service 
            and copyright laws when downloading content. Only download videos you have permission to download.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;