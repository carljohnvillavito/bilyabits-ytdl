import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiShield, FiInfo, FiGithub, FiFacebook } = FiIcons;

const Footer = () => {
  const socialLinks = {
    github: 'https://github.com/carljohnvillavito/bilyabits-ytdl',
    facebook: 'https://facebook.com/carljohn.villavito'
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-black/60 backdrop-blur-sm border-t border-zinc-800/50 mt-8 md:mt-12"
    >
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="text-center space-y-2 md:space-y-4">
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-red-500 to-green-500 bg-clip-text text-transparent">
            BILYABITS-ytdl
          </h2>
          
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-xs md:text-sm">
            <span>Made with</span>
            <SafeIcon icon={FiHeart} className="text-red-600" />
            <span>for YouTube enthusiasts</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiShield} className="text-green-500" />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiInfo} className="text-red-600" />
              <span>Respect Copyright</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 mt-2 md:mt-3">
            <motion.a 
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-green-500 transition-colors duration-300"
            >
              <SafeIcon icon={FiGithub} className="text-lg md:text-xl" />
            </motion.a>
            <motion.a 
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-red-600 transition-colors duration-300"
            >
              <SafeIcon icon={FiFacebook} className="text-lg md:text-xl" />
            </motion.a>
          </div>
          
          <p className="text-[10px] md:text-xs text-gray-600 max-w-2xl mx-auto px-2">
            This tool is for educational purposes only. Please respect YouTube's terms of service 
            and copyright laws when downloading content. Only download videos you have permission to download.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;