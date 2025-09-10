import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const VolumeControl = ({ volume, onVolumeChange, isMuted, onMuteToggle }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateVolume(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateVolume(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateVolume = (e) => {
    if (!sliderRef?.current) return;

    const rect = sliderRef?.current?.getBoundingClientRect();
    const x = e?.clientX - rect?.left;
    const percentage = Math.max(0, Math.min(1, x / rect?.width));
    onVolumeChange(percentage);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return "VolumeX";
    if (volume < 0.3) return "Volume";
    if (volume < 0.7) return "Volume1";
    return "Volume2";
  };

  const volumePercentage = Math.round(volume * 100);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center space-x-4"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      {/* Mute/Unmute Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMuteToggle}
        className="relative group ripple-effect"
      >
        <Icon
          name={getVolumeIcon()}
          size={24}
          className={`transition-colors duration-300 ${
            isMuted
              ? "text-destructive"
              : "text-foreground group-hover:text-primary"
          }`}
        />
      </Button>
      {/* Volume Slider Container */}
      <div
        className={`relative transition-all duration-300 ${
          showVolumeSlider
            ? "w-32 opacity-100"
            : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        {/* Volume Slider */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-muted rounded-full cursor-pointer group"
          onMouseDown={handleMouseDown}
        >
          {/* Background Track */}
          <div className="absolute inset-0 bg-muted rounded-full" />

          {/* Volume Fill */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-200"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          />

          {/* Volume Handle */}
          <div
            className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-primary transition-all duration-200 ${
              isDragging ? "scale-125" : "group-hover:scale-110"
            }`}
            style={{
              left: `${isMuted ? 0 : volume * 100}%`,
              marginLeft: "-8px",
            }}
          />

          {/* Hover Glow Effect */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              left: `${isMuted ? 0 : volume * 100}%`,
              marginLeft: "-12px",
            }}
          />
        </div>

        {/* Volume Percentage Tooltip */}
        <div
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-surface rounded text-xs text-foreground transition-all duration-200 ${
            showVolumeSlider && !isDragging ? "opacity-0" : "opacity-100"
          }`}
        >
          {isMuted ? "0%" : `${volumePercentage}%`}
        </div>
      </div>
      {/* Volume Percentage Display */}
      <div className="min-w-[3rem] text-right">
        <span className="text-sm text-muted-foreground font-mono">
          {isMuted ? "0%" : `${volumePercentage}%`}
        </span>
      </div>
      {/* Visual Volume Bars */}
      <div className="flex items-center space-x-1">
        {[...Array(5)]?.map((_, i) => {
          const barThreshold = (i + 1) / 5;
          const isActive = !isMuted && volume >= barThreshold;

          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isActive ? "bg-primary shadow-glow" : "bg-muted"
              }`}
              style={{
                height: `${8 + i * 2}px`,
                opacity: isActive ? 1 : 0.3,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default VolumeControl;
