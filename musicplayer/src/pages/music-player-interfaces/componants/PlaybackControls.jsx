import React from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const PlaybackControls = ({
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onPrevious,
  onNext,
  isLoading,
  canGoNext,
  canGoPrevious,
}) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="flex items-center justify-center space-x-6">
      {/* Previous Track */}
      <Button
        variant="ghost"
        size="lg"
        disabled={!canGoPrevious || isLoading}
        onClick={onPrevious}
        className="relative group ripple-effect"
      >
        <Icon
          name="SkipBack"
          size={28}
          className={`transition-colors duration-300 ${
            canGoPrevious
              ? "text-foreground group-hover:text-primary"
              : "text-muted-foreground"
          }`}
        />
      </Button>

      {/* Play/Pause Button */}
      <Button
        variant="default"
        size="xl"
        disabled={isLoading}
        onClick={handlePlayPause}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-glow hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all duration-300 group"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Icon
            name={isPlaying ? "Pause" : "Play"}
            size={24}
            color="white"
            className="group-hover:scale-110 transition-transform duration-200"
          />
        )}

        {/* Pulse Animation for Playing State */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-ping opacity-30" />
        )}
      </Button>

      {/* Stop Button */}
      <Button
        variant="ghost"
        size="lg"
        disabled={isLoading}
        onClick={onStop}
        className="relative group ripple-effect"
      >
        <Icon
          name="Square"
          size={24}
          className="text-foreground group-hover:text-destructive transition-colors duration-300"
        />
      </Button>

      {/* Next Track */}
      <Button
        variant="ghost"
        size="lg"
        disabled={!canGoNext || isLoading}
        onClick={onNext}
        className="relative group ripple-effect"
      >
        <Icon
          name="SkipForward"
          size={28}
          className={`transition-colors duration-300 ${
            canGoNext
              ? "text-foreground group-hover:text-primary"
              : "text-muted-foreground"
          }`}
        />
      </Button>
    </div>
  );
};

export default PlaybackControls;
