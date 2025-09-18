import React from 'react';
import Icon from '../../../components/AppIcon';

const TrackInfo = ({ 
  currentTrack, 
  currentTime, 
  duration, 
  onSeek 
}) => {
  const handleProgressClick = (e) => {
    if (!duration) return;
    
    
    const rect = e?.currentTarget?.getBoundingClientRect();
    const clickX = e?.clientX - rect?.left;
    const progress = clickX / rect?.width;
    const newTime = progress * duration;
    onSeek(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds)?.padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* Track Information */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-heading">
          {currentTrack?.title || "No Track Selected"}
        </h2>
        <p className="text-lg text-muted-foreground mb-1">
          {currentTrack?.artist || "Unknown Artist"}
        </p>
        <p className="text-sm text-muted-foreground">
          {currentTrack?.album || "Unknown Album"}
        </p>
      </div>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div 
          className="relative h-2 bg-surface rounded-full cursor-pointer group"
          onClick={handleProgressClick}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-muted/20 rounded-full"></div>
          
          {/* Progress */}
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full smooth-transition"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Progress Handle */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 smooth-transition"
            style={{ left: `calc(${progress}% - 8px)` }}
          ></div>
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-sm text-muted-foreground font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* Track Metadata */}
      {currentTrack && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="glass rounded-lg p-3">
            <Icon name="Music" size={20} className="mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Genre</p>
            <p className="text-sm font-medium">{currentTrack?.genre || "Unknown"}</p>
          </div>
          
          <div className="glass rounded-lg p-3">
            <Icon name="Calendar" size={20} className="mx-auto mb-1 text-secondary" />
            <p className="text-xs text-muted-foreground">Year</p>
            <p className="text-sm font-medium">{currentTrack?.year || "Unknown"}</p>
          </div>
          
          <div className="glass rounded-lg p-3">
            <Icon name="Clock" size={20} className="mx-auto mb-1 text-accent" />
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">{formatTime(duration)}</p>
          </div>
          
          <div className="glass rounded-lg p-3">
            <Icon name="Disc" size={20} className="mx-auto mb-1 text-primary" />
            <p className="text-xs text-muted-foreground">Format</p>
            <p className="text-sm font-medium">{currentTrack?.format || "MP3"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackInfo;