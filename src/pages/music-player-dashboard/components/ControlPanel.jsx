import React from 'react';
import Icon from '../../../components/AppIcon';

const ControlPanel = ({ 
  volume, 
  onVolumeChange, 
  isShuffled, 
  onShuffleToggle, 
  repeatMode, 
  onRepeatToggle,
  isMuted,
  onMuteToggle 
}) => {
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return 'Repeat1';
      case 'all': return 'Repeat';
      default: return 'Repeat';
    }
  };

  const getRepeatColor = () => {
    return repeatMode !== 'off' ? 'var(--color-primary)' : 'var(--color-muted)';
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* Main Controls */}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMuteToggle}
              className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-primary/20 smooth-transition"
            >
              <Icon 
                name={isMuted ? "VolumeX" : volume > 50 ? "Volume2" : volume > 0 ? "Volume1" : "VolumeX"} 
                size={18} 
                color={isMuted ? "var(--color-muted)" : "var(--color-foreground)"} 
              />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseInt(e?.target?.value))}
                className="w-full h-2 bg-surface rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${isMuted ? 0 : volume}%, var(--color-surface) ${isMuted ? 0 : volume}%, var(--color-surface) 100%)`
                }}
              />
            </div>
            
            <span className="text-sm text-muted-foreground font-mono w-8 text-right">
              {isMuted ? 0 : volume}
            </span>
          </div>

          {/* Playback Mode Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={onShuffleToggle}
              className={`w-12 h-12 rounded-full flex items-center justify-center smooth-transition ${
                isShuffled 
                  ? 'bg-primary text-white' :'bg-surface hover:bg-primary/20'
              }`}
            >
              <Icon 
                name="Shuffle" 
                size={20} 
                color={isShuffled ? "white" : "var(--color-muted)"} 
              />
            </button>

            <button
              onClick={onRepeatToggle}
              className={`w-12 h-12 rounded-full flex items-center justify-center smooth-transition ${
                repeatMode !== 'off' ?'bg-secondary text-white' :'bg-surface hover:bg-secondary/20'
              }`}
            >
              <Icon 
                name={getRepeatIcon()} 
                size={20} 
                color={repeatMode !== 'off' ? "white" : "var(--color-muted)"} 
              />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center justify-end space-x-3">
            <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-accent/20 smooth-transition">
              <Icon name="ListMusic" size={18} color="var(--color-muted)" />
            </button>
            
            <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-accent/20 smooth-transition">
              <Icon name="Heart" size={18} color="var(--color-muted)" />
            </button>
            
            <button className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-accent/20 smooth-transition">
              <Icon name="Share2" size={18} color="var(--color-muted)" />
            </button>
          </div>
        </div>
      </div>
      {/* Keyboard Shortcuts */}
      <div className="mt-6 glass rounded-xl p-4">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Icon name="Keyboard" size={16} className="mr-2" />
          Keyboard Shortcuts
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Play/Pause</span>
            <kbd className="px-2 py-1 bg-surface rounded text-foreground font-mono">Space</kbd>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Next</span>
            <kbd className="px-2 py-1 bg-surface rounded text-foreground font-mono">→</kbd>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Previous</span>
            <kbd className="px-2 py-1 bg-surface rounded text-foreground font-mono">←</kbd>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Volume</span>
            <kbd className="px-2 py-1 bg-surface rounded text-foreground font-mono">↑↓</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ControlPanel;