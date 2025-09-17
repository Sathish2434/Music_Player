import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CircularPlayer = ({ 
  currentTrack, 
  isPlaying, 
  currentTime, 
  duration, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  onStop,
  onSeek 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const playerRef = useRef(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 120; // radius of 120px
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleProgressClick = (e) => {
    if (!playerRef?.current || !duration) return;
    
    const rect = playerRef?.current?.getBoundingClientRect();
    const centerX = rect?.left + rect?.width / 2;
    const centerY = rect?.top + rect?.height / 2;
    const x = e?.clientX - centerX;
    const y = e?.clientY - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360; // Normalize to 0-360, starting from top
    
    const newProgress = angle / 360;
    const newTime = newProgress * duration;
    onSeek(newTime);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient Glow Background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl animate-pulse-audio"></div>
      {/* Main Circular Player */}
      <div 
        ref={playerRef}
        className="relative w-80 h-80 rounded-full glass neo-morph cursor-pointer group"
        onClick={handleProgressClick}
      >
        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 280 280">
          {/* Background Circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="140"
            cy="140"
            r="120"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="circular-progress smooth-transition"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="50%" stopColor="var(--color-secondary)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Album Art */}
        <div className="absolute inset-4 rounded-full overflow-hidden">
          <Image
            src={currentTrack?.artwork || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"}
            alt={currentTrack?.title || "Album artwork"}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 smooth-transition">
            <div className="flex items-center space-x-4">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onPrevious();
                }}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 smooth-transition"
              >
                <Icon name="SkipBack" size={20} color="white" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onPlayPause();
                }}
                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 smooth-transition shadow-lg"
              >
                <Icon 
                  name={isPlaying ? "Pause" : "Play"} 
                  size={24} 
                  color="white" 
                  className={!isPlaying ? "ml-1" : ""}
                />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onNext();
                }}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 smooth-transition"
              >
                <Icon name="SkipForward" size={20} color="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Stop Button - Bottom Right */}
        <button
          onClick={(e) => {
            e?.stopPropagation();
            onStop();
          }}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-error/80 backdrop-blur-sm flex items-center justify-center hover:bg-error smooth-transition"
        >
          <Icon name="Square" size={16} color="white" />
        </button>

        {/* Time Display - Bottom Left */}
        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
          <span className="text-xs text-white font-mono">
            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60))?.padStart(2, '0')}
          </span>
        </div>
      </div>
      {/* Floating Particles */}
      {isPlaying && (
        <>
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/4 right-0 w-3 h-3 bg-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-accent rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-primary rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }}></div>
        </>
      )}
    </div>
  );
};

export default CircularPlayer;