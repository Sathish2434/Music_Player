import React from "react";
import Icon from "../../../components/AppIcon";

const TrackInfo = ({ currentTrack, isPlaying }) => {
  if (!currentTrack) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
          <Icon name="Music" size={32} className="text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-muted-foreground mb-2">
          No Track Selected
        </h2>
        <p className="text-muted-foreground">
          Load an audio file to start listening
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-6">
      {/* Track Title */}
      <h1
        className={`text-3xl font-bold mb-2 transition-all duration-500 ${
          isPlaying
            ? "text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent animate-pulse"
            : "text-foreground"
        }`}
      >
        {currentTrack?.title}
      </h1>
      {/* Artist Name */}
      <p className="text-xl text-muted-foreground mb-1 font-medium">
        {currentTrack?.artist}
      </p>
      {/* Album Name */}
      {currentTrack?.album && (
        <p className="text-lg text-muted-foreground/80 mb-4">
          {currentTrack?.album}
        </p>
      )}
      {/* Track Metadata */}
      <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
        {/* Genre */}
        {currentTrack?.genre && (
          <div className="flex items-center space-x-1">
            <Icon name="Tag" size={16} />
            <span>{currentTrack?.genre}</span>
          </div>
        )}

        {/* Year */}
        {currentTrack?.year && (
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={16} />
            <span>{currentTrack?.year}</span>
          </div>
        )}

        {/* Duration */}
        {currentTrack?.duration && (
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={16} />
            <span>{formatDuration(currentTrack?.duration)}</span>
          </div>
        )}
      </div>
      {/* Playing Indicator */}
      {isPlaying && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className="flex space-x-1">
            {[...Array(4)]?.map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-pulse"
                style={{
                  height: `${8 + Math.random() * 16}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.8s",
                }}
              />
            ))}
          </div>
          <span className="text-primary text-sm font-medium">Now Playing</span>
        </div>
      )}
      {/* Visual Equalizer Effect */}
      {isPlaying && (
        <div className="flex items-center justify-center mt-6 space-x-1">
          {[...Array(20)]?.map((_, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full transition-all duration-300"
              style={{
                height: `${4 + Math.sin(Date.now() * 0.01 + i) * 8}px`,
                opacity: 0.6 + Math.sin(Date.now() * 0.005 + i) * 0.4,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs?.toString()?.padStart(2, "0")}`;
};

export default TrackInfo;
