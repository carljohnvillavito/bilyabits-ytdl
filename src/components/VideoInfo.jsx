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
      className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-4 md:p-6 hover:border-red-600/30 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="relative group mx-auto md:mx-0">
          <img
            src={videoInfo.thumbnail}
            alt={videoInfo.title}
            className="w-full max-w-xs md:w-80 h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/320x180/374151/9CA3AF?text=Video+Thumbnail';
            }}
          />
          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <SafeIcon icon={FiPlay} className="text-4xl text-white" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {videoInfo.duration}
          </div>
        </div>
        
        <div className="flex-1 space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
            {videoInfo.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <SafeIcon icon={FiUser} className="text-red-600" />
              <span>{videoInfo.author}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <SafeIcon icon={FiEye} className="text-red-600" />
              <span>{videoInfo.views} views</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <SafeIcon icon={FiCalendar} className="text-red-600" />
              <span>{formatDate(videoInfo.uploadDate)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <SafeIcon icon={FiClock} className="text-red-600" />
              <span>{videoInfo.duration}</span>
            </div>
          </div>
          
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-3 md:line-clamp-none">
            {videoInfo.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoInfo;