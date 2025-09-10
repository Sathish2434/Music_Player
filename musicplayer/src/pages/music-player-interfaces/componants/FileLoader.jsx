import React, { useRef, useState } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

// Sample tracks for demonstration
const sampleTracks = [
  {
    title: "Ambient Dreams",
    artist: "Digital Soundscape",
    album: "Electronic Moods",
    genre: "Ambient",
    year: 2024,
    duration: 245,
    artwork:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
  },
  {
    title: "Neon Nights",
    artist: "Synthwave Collective",
    album: "Retro Future",
    genre: "Synthwave",
    year: 2024,
    duration: 198,
    artwork:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
  },
  {
    title: "Ocean Waves",
    artist: "Nature Sounds",
    album: "Peaceful Moments",
    genre: "Ambient",
    year: 2024,
    duration: 320,
    artwork:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop",
  },
];

const FileLoader = ({ onFileLoad, isLoading }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (files) => {
    if (files && files?.length > 0) {
      const file = files?.[0];
      if (file?.type?.startsWith("audio/")) {
        onFileLoad(file);
      } else {
        alert("Please select a valid audio file");
      }
    }
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e?.target?.files);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e?.dataTransfer?.files);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isLoading}
      />
      {/* Drag & Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/10 scale-105"
            : "border-muted-foreground/30 hover:border-primary/50 hover:bg-surface/50"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isLoading ? openFileDialog : undefined}
      >
        {/* Upload Icon */}
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDragOver
              ? "bg-primary/20 text-primary scale-110"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <Icon
              name={isDragOver ? "Download" : "Upload"}
              size={32}
              className="transition-transform duration-300"
            />
          )}
        </div>

        {/* Upload Text */}
        <div className="space-y-2">
          <h3
            className={`text-lg font-semibold transition-colors duration-300 ${
              isDragOver ? "text-primary" : "text-foreground"
            }`}
          >
            {isLoading ? "Loading Audio..." : "Load Audio File"}
          </h3>

          <p className="text-muted-foreground text-sm">
            {isDragOver
              ? "Drop your audio file here"
              : "Drag & drop an audio file here, or click to browse"}
          </p>

          <p className="text-xs text-muted-foreground">
            Supports MP3, WAV, OGG, M4A formats
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Processing audio file...
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Quick Load Buttons */}
      <div className="mt-6 space-y-3">
        <p className="text-sm text-muted-foreground text-center">
          Or try these sample tracks:
        </p>

        <div className="grid grid-cols-1 gap-2">
          {sampleTracks?.map((track, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onFileLoad(track)}
              className="justify-start space-x-2"
            >
              <Icon name="Music" size={16} />
              <span className="truncate">
                {track?.title} - {track?.artist}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileLoader;
