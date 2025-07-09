import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSettings, FiVideo, FiMusic, FiHardDrive } = FiIcons;

const FormatSelector = ({ 
  selectedFormat, 
  selectedQuality, 
  onFormatChange, 
  onQualityChange, 
  availableFormats 
}) => {
  const formats = [
    { value: 'mp4', label: 'MP4 Video', icon: FiVideo },
    { value: 'webm', label: 'WebM Video', icon: FiVideo },
    { value: 'mp3', label: 'MP3 Audio', icon: FiMusic },
  ];

  const getQualitiesForFormat = (format) => {
    return availableFormats
      .filter(f => f.format === format)
      .map(f => ({ value: f.quality, label: f.quality, size: f.size }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-dark-700/30 backdrop-blur-sm border border-dark-600/50 rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300"
    >
      <div className="flex items-center space-x-2 mb-6">
        <SafeIcon icon={FiSettings} className="text-primary-500 text-xl" />
        <h3 className="text-xl font-bold text-white">Format & Quality</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Format
          </label>
          <div className="grid grid-cols-1 gap-2">
            {formats.map((format) => (
              <motion.button
                key={format.value}
                onClick={() => onFormatChange(format.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-lg border transition-all duration-300 flex items-center space-x-3 ${
                  selectedFormat === format.value
                    ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                    : 'bg-dark-600/50 border-dark-500 text-gray-400 hover:border-primary-500/50'
                }`}
              >
                <SafeIcon icon={format.icon} className="text-lg" />
                <span className="font-medium">{format.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Quality
          </label>
          <div className="space-y-2">
            {getQualitiesForFormat(selectedFormat).map((quality) => (
              <motion.button
                key={quality.value}
                onClick={() => onQualityChange(quality.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 rounded-lg border transition-all duration-300 flex items-center justify-between ${
                  selectedQuality === quality.value
                    ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                    : 'bg-dark-600/50 border-dark-500 text-gray-400 hover:border-primary-500/50'
                }`}
              >
                <span className="font-medium">{quality.label}</span>
                <div className="flex items-center space-x-2 text-sm">
                  <SafeIcon icon={FiHardDrive} className="text-xs" />
                  <span>{quality.size}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FormatSelector;