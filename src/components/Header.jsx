import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiDownload, FiYoutube, FiGithub, FiFacebook, FiMenu, FiX } = FiIcons;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const socialLinks = {
    github: 'https://github.com/carljohnvillavito/bilyabits-ytdl',
    facebook: 'https://facebook.com/carljohn.villavito'
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-black/80 backdrop-blur-sm border-b border-zinc-800/50 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <SafeIcon 
                icon={FiDownload} 
                className="text-lg md:text-xl text-red-600" 
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              BILYABITS-ytdl
            </h1>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-2 text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <SafeIcon icon={FiYoutube} className="text-red-600" />
              <span className="text-sm">Download videos in HD quality</span>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.a 
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-green-500 transition-colors duration-300"
              >
                <SafeIcon icon={FiGithub} className="text-lg" />
              </motion.a>
              <motion.a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-green-500 transition-colors duration-300"
              >
                <SafeIcon icon={FiFacebook} className="text-lg" />
              </motion.a>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-400 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <SafeIcon icon={mobileMenuOpen ? FiX : FiMenu} className="text-xl" />
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                <motion.div 
                  className="flex items-center space-x-2 text-gray-400 justify-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <SafeIcon icon={FiYoutube} className="text-red-600" />
                  <span className="text-sm">Download videos in HD quality</span>
                </motion.div>
                
                <div className="flex justify-center space-x-8">
                  <motion.a 
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-green-500 transition-colors duration-300"
                  >
                    <SafeIcon icon={FiGithub} className="text-xl" />
                  </motion.a>
                  <motion.a 
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-green-500 transition-colors duration-300"
                  >
                    <SafeIcon icon={FiFacebook} className="text-xl" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;