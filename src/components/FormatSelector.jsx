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

  // Filter formats to only show those that are available
  const availableFormatTypes = [...new Set(availableFormats.map(f => f.format))];
  const filteredFormats = formats.filter(f => availableFormatTypes.includes(f.value));

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
      className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4 md:p-5 hover:border-red-600/30 transition-all duration-300"
    >
      <div className="flex items-center space-x-2 mb-3 md:mb-4">
        <SafeIcon icon={FiSettings} className="text-base md:text-lg text-red-600" />
        <h3 className="text-base md:text-lg font-bold text-white">Format & Quality</h3>
      </div>
      
      <div className="space-y-3 md:space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {filteredFormats.map((format) => (
              <motion.button
                key={format.value}
                onClick={() => {
                  onFormatChange(format.value);
                  // Also set a default quality for this format
                  const qualities = getQualitiesForFormat(format.value);
                  if (qualities.length > 0) {
                    onQualityChange(qualities[0].value);
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-2 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center space-y-1 text-xs ${
                  selectedFormat === format.value
                    ? 'bg-red-600/20 border-red-600 text-red-400'
                    : 'bg-zinc-800/50 border-zinc-700 text-gray-400 hover:border-green-500/50'
                }`}
              >
                <SafeIcon icon={format.icon} className="text-base md:text-lg" />
                <span className="font-medium">{format.value.toUpperCase()}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            Quality
          </label>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
            {getQualitiesForFormat(selectedFormat).map((quality) => (
              <motion.button
                key={quality.value}
                onClick={() => onQualityChange(quality.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-2 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center text-xs ${
                  selectedQuality === quality.value
                    ? 'bg-red-600/20 border-red-600 text-red-400'
                    : 'bg-zinc-800/50 border-zinc-700 text-gray-400 hover:border-green-500/50'
                }`}
              >
                <span className="font-medium mb-1">{quality.label}</span>
                <div className="flex items-center space-x-1 text-xs">
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