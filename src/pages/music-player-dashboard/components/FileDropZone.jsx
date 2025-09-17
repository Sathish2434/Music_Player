import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';

const FileDropZone = ({ onFileLoad, isActive }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const audioFiles = files?.filter(file => file?.type?.startsWith('audio/'));
    
    if (audioFiles?.length > 0) {
      onFileLoad(audioFiles?.[0]);
    }
  }, [onFileLoad]);

  const handleFileInput = useCallback((e) => {
    const file = e?.target?.files?.[0];
    if (file && file?.type?.startsWith('audio/')) {
      onFileLoad(file);
    }
  }, [onFileLoad]);

  if (!isActive) return null;

  return (
    <>
      {/* Drop Zone Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isDragOver 
            ? 'bg-black/80 backdrop-blur-sm opacity-100' :'bg-transparent pointer-events-none opacity-0'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`glass rounded-3xl p-12 text-center transition-all duration-300 ${
          isDragOver ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Icon name="Upload" size={40} color="var(--color-primary)" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2">Drop Your Music Here</h3>
          <p className="text-muted-foreground mb-6">
            Release to add audio files to your player
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Music" size={16} />
            <span>Supports MP3, WAV, OGG, M4A</span>
          </div>
        </div>
      </div>

      {/* File Input Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <label className="w-14 h-14 rounded-full bg-primary hover:bg-primary/80 flex items-center justify-center cursor-pointer smooth-transition shadow-lg hover-lift">
          <Icon name="Plus" size={24} color="white" />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Drag Instructions */}
      {!isDragOver && (
        <div className="fixed bottom-6 left-6 glass rounded-xl p-4 max-w-xs">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Quick Tip</p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag & drop audio files anywhere on the screen to load them instantly
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileDropZone;