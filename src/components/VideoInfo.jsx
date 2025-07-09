import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { formatDate } from '../utils/date';

const { FiPlay, FiEye, FiUser, FiCalendar, FiClock } = FiIcons;

const VideoInfo = ({ videoInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-4 md:p-5 hover:border-red-600/30 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="relative group w-full md:w-auto">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-full md:w-72 h-40 md:h-44 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/320x180/374151/9CA3AF?text=Video+Thumbnail';
            }}
          />
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <SafeIcon icon={FiPlay} className="text-3xl text-white" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {videoInfo.duration}
          </div>
        </div>
        
        <div className="flex-1 space-y-2 md:space-y-3">
          <h3 className="text-base md:text-lg font-bold text-white leading-tight">
            {videoInfo.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <div className="flex items-center space-x-1.5 text-gray-400">
              <SafeIcon icon={FiUser} className="text-red-600 text-xs" />
              <span>{videoInfo.author}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-400">
              <SafeIcon icon={FiEye} className="text-red-600 text-xs" />
              <span>{videoInfo.views} views</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-400">
              <SafeIcon icon={FiCalendar} className="text-red-600 text-xs" />
              <span>{formatDate(videoInfo.uploadDate)}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-400">
              <SafeIcon icon={FiClock} className="text-red-600 text-xs" />
              <span>{videoInfo.duration}</span>
            </div>
          </div>
          
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
            {videoInfo.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoInfo;