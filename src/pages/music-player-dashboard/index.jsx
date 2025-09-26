import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import CircularPlayer from './components/CircularPlayer';
import TrackInfo from './components/TrackInfo';
import ControlPanel from './components/ControlPanel';
import VisualEffects from './components/VisualEffects';
import FileDropZone from './components/FileDropZone';

const MusicPlayerDashboard = () => {
  // Audio state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
  
  // UI state
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Refs
  const audioRef = useRef(null);
  const previousVolumeRef = useRef(75);

  // Load local audio files from src/musics/
  const localAudioFiles = useMemo(() => {
    try {
      return import.meta.glob('../../musics/*.{mp3,wav,ogg,m4a}', { eager: true, query: '?url', import: 'default' });
    } catch (e) {
      return {};
    }
  }, []);

  const [playlist, setPlaylist] = useState([]);

  // Initialize playlist from local files
  useEffect(() => {
    const entries = Object.entries(localAudioFiles || {});
    const localTracks = entries.map(([path, url], idx) => {
      const fileName = path.split('/').pop() || `Track_${idx + 1}`;
      const title = fileName.replace(/\.[^/.]+$/, '');
      const extMatch = fileName.match(/\.([^.]+)$/);
      const format = extMatch ? extMatch[1].toUpperCase() : 'MP3';
      return {
        id: Date.now() + idx,
        title,
        artist: 'Local File',
        album: 'My Library',
        genre: 'Unknown',
        year: new Date()?.getFullYear()?.toString(),
        format,
        duration: 0,
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        url
      };
    });
    if (localTracks.length) {
      setPlaylist(prev => (prev.length ? prev : localTracks));
    }
  }, [localAudioFiles]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Initialize first track when playlist available
  useEffect(() => {
    if (playlist?.length > 0 && !currentTrack) {
      setCurrentTrack(playlist?.[0]);
    }
  }, [playlist, currentTrack]);

  // Update audio source when current track changes
  useEffect(() => {
    if (audioRef?.current && currentTrack?.url) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Fetch additional tracks from iTunes (Tamil and English previews)
  useEffect(() => {
    const fetchITunes = async (term, country = 'IN', limit = 15) => {
      const params = new URLSearchParams({ term, media: 'music', entity: 'song', country, limit: String(limit) });
      const res = await fetch(`https://itunes.apple.com/search?${params.toString()}`);
      const data = await res.json();
      return (data?.results || []).map((r, idx) => ({
        id: Date.now() + Math.floor(Math.random() * 1e6) + idx,
        title: r?.trackName || 'Unknown',
        artist: r?.artistName || 'Unknown',
        album: r?.collectionName || 'Unknown',
        genre: r?.primaryGenreName || 'Unknown',
        year: r?.releaseDate ? String(r.releaseDate).slice(0, 4) : undefined,
        format: 'MP3',
        duration: 0,
        artwork: r?.artworkUrl100 ? r.artworkUrl100.replace('100x100bb', '400x400bb') : "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        url: r?.previewUrl
      })).filter(t => !!t.url);
    };

    let aborted = false;
    (async () => {
      try {
        const [tamil, english] = await Promise.all([
          fetchITunes('tamil songs', 'IN', 15),
          fetchITunes('english songs', 'US', 15)
        ]);
        if (!aborted) {
          setPlaylist(prev => [...prev, ...tamil, ...english]);
        }
      } catch (e) {
        // ignore network errors for now
      }
    })();
    return () => { aborted = true; };
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio?.currentTime);
    const handleLoadedMetadata = () => setDuration(audio?.duration);
    const handleEnded = () => handleNext();

    audio?.addEventListener('timeupdate', handleTimeUpdate);
    audio?.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio?.addEventListener('ended', handleEnded);

    return () => {
      audio?.removeEventListener('timeupdate', handleTimeUpdate);
      audio?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio?.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Volume control
  useEffect(() => {
    if (audioRef?.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.target?.tagName === 'INPUT') return;

      switch (e?.code) {
        case 'Space':
          e?.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowRight':
          e?.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e?.preventDefault();
          handlePrevious();
          break;
        case 'ArrowUp':
          e?.preventDefault();
          setVolume(prev => Math.min(100, prev + 5));
          break;
        case 'ArrowDown':
          e?.preventDefault();
          setVolume(prev => Math.max(0, prev - 5));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Drag and drop handlers
  useEffect(() => {
    const handleDragEnter = (e) => {
      e?.preventDefault();
      setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
      e?.preventDefault();
      if (!e?.relatedTarget || !document.body?.contains(e?.relatedTarget)) {
        setIsDragActive(false);
      }
    };

    const handleDragOver = (e) => {
      e?.preventDefault();
    };

    const handleDrop = (e) => {
      e?.preventDefault();
      setIsDragActive(false);
    };

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Player controls
  const handlePlayPause = useCallback(() => {
    if (!audioRef?.current) return;

    if (isPlaying) {
      audioRef?.current?.pause();
    } else {
      audioRef?.current?.play()?.catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleStop = useCallback(() => {
    if (!audioRef?.current) return;
    
    audioRef?.current?.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleNext = useCallback(() => {
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist?.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % playlist?.length;
    }
    
    setCurrentTrackIndex(nextIndex);
    setCurrentTrack(playlist?.[nextIndex]);
    setCurrentTime(0);
    
    if (isPlaying) {
      setTimeout(() => {
        audioRef?.current?.play()?.catch(console.error);
      }, 100);
    }
  }, [currentTrackIndex, playlist, isShuffled, isPlaying]);

  const handlePrevious = useCallback(() => {
    let prevIndex;
    
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * playlist?.length);
    } else {
      prevIndex = currentTrackIndex === 0 ? playlist?.length - 1 : currentTrackIndex - 1;
    }
    
    setCurrentTrackIndex(prevIndex);
    setCurrentTrack(playlist?.[prevIndex]);
    setCurrentTime(0);
    
    if (isPlaying) {
      setTimeout(() => {
        audioRef?.current?.play()?.catch(console.error);
      }, 100);
    }
  }, [currentTrackIndex, playlist, isShuffled, isPlaying]);

  const handleSeek = useCallback((time) => {
    if (audioRef?.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolumeRef?.current);
    } else {
      previousVolumeRef.current = volume;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleShuffleToggle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  const handleRepeatToggle = useCallback(() => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes?.indexOf(repeatMode);
    let nextIndex = (currentIndex + 1) % modes?.length;
    setRepeatMode(modes?.[nextIndex]);
  }, [repeatMode]);

  const handleFileLoad = useCallback((file) => {
    const url = URL.createObjectURL(file);
    const newTrack = {
      id: Date.now(),
      title: file?.name?.replace(/\.[^/.]+$/, ""),
      artist: "Unknown Artist",
      album: "Unknown Album",
      genre: "Unknown",
      year: new Date()?.getFullYear()?.toString(),
      format: file?.type?.split('/')?.[1]?.toUpperCase(),
      duration: 0,
      artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      url: url
    };
    
    setCurrentTrack(newTrack);
    setCurrentTime(0);
    
    if (audioRef?.current) {
      audioRef.current.src = url;
      audioRef?.current?.load();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/50 to-background"></div>
      {/* Visual Effects */}
      <VisualEffects 
        isPlaying={isPlaying} 
        currentTime={currentTime}
        audioData={null}
      />
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
              Circular Music Player
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience music like never before with our immersive circular player featuring dynamic visual effects and intuitive controls.
            </p>
          </div>

          {/* Circular Player */}
          <CircularPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onStop={handleStop}
            onSeek={handleSeek}
          />

          {/* Track Information */}
          <TrackInfo
            currentTrack={currentTrack}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />

          {/* Control Panel */}
          <ControlPanel
            volume={volume}
            onVolumeChange={handleVolumeChange}
            isShuffled={isShuffled}
            onShuffleToggle={handleShuffleToggle}
            repeatMode={repeatMode}
            onRepeatToggle={handleRepeatToggle}
            isMuted={isMuted}
            onMuteToggle={handleMuteToggle}
          />
        </div>
      </div>
      {/* File Drop Zone */}
      <FileDropZone
        onFileLoad={handleFileLoad}
        isActive={isDragActive}
      />
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        className="hidden"
      />
      {/* Footer */}
      <footer className="relative z-10 text-center py-8 border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          © {new Date()?.getFullYear()} Circular Music Player. Crafted with passion for music lovers.
        </p>
      </footer>
    </div>
  );
};

export default MusicPlayerDashboard;