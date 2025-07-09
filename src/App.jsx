import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import VideoDownloader from './components/VideoDownloader';
import Footer from './components/Footer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';

const { FiSettings, FiX } = FiIcons;

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    github: 'https://github.com/bilyabits/ytdl',
    facebook: 'https://facebook.com/bilyabits'
  });

  const handleSaveSocialLinks = (newLinks) => {
    setSocialLinks(newLinks);
    setShowSettings(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
        <Header socialLinks={socialLinks} />
        
        <main className="container mx-auto px-4 py-8 relative">
          <Routes>
            <Route path="/" element={<VideoDownloader />} />
          </Routes>
          
          {/* Settings Button */}
          <motion.button
            onClick={() => setShowSettings(true)}
            className="fixed bottom-4 right-4 z-40 bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SafeIcon icon={FiSettings} className="text-xl" />
          </motion.button>
          
          {/* Settings Modal */}
          <AnimatePresence>
            {showSettings && (
              <SettingsModal 
                onClose={() => setShowSettings(false)} 
                socialLinks={socialLinks}
                onSave={handleSaveSocialLinks}
              />
            )}
          </AnimatePresence>
        </main>
        
        <Footer socialLinks={socialLinks} />
      </div>
    </Router>
  );
}

// Settings Modal Component
const SettingsModal = ({ onClose, socialLinks, onSave }) => {
  const [links, setLinks] = useState(socialLinks);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    onSave(links);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="github"
              value={links.github}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Facebook URL
            </label>
            <input
              type="url"
              name="facebook"
              value={links.facebook}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              placeholder="https://facebook.com/username"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default App;