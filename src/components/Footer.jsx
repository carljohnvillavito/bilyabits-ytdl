import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHeart, FiShield, FiInfo } = FiIcons;

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-dark-800/30 backdrop-blur-sm border-t border-dark-700/50 mt-16"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-400">
            <span>Made with</span>
            <SafeIcon icon={FiHeart} className="text-primary-500" />
            <span>for YouTube enthusiasts</span>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiShield} />
              <span>Safe & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiInfo} />
              <span>Respect Copyright</span>
            </div>
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