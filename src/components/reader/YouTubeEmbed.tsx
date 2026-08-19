import React from 'react';
import { motion } from 'framer-motion';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
}

export function YouTubeEmbed({ videoId, title = 'Video ya Hadithi' }: YouTubeEmbedProps) {
  if (!videoId) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full my-8 flex flex-col gap-2"
    >
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs uppercase tracking-wider font-semibold text-wine-bright">
          Sikiliza
        </span>
        <div className="h-px flex-1 bg-line" />
      </div>
      
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-wine/30 bg-ink shadow-lg shadow-wine/5">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&fs=1&controls=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-presentation allow-fullscreen"
        />
      </div>
    </motion.div>
  );
}
