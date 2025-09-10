import React, { useRef, useEffect, useState } from "react";
import Image from "../../../components/AppImage";

const CircularPlayer = ({
  currentTrack,
  isPlaying,
  progress,
  duration,
  audioRef,
  onProgressChange,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Initialize particles for visual effects
  useEffect(() => {
    const initParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles?.push({
          id: i,
          angle: (i / 50) * Math.PI * 2,
          radius: 180 + Math.random() * 40,
          speed: 0.005 + Math.random() * 0.01,
          size: 2 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.7,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        });
      }
      setParticles(newParticles);
    };

    initParticles();
  }, []);

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext("2d");
    const centerX = canvas?.width / 2;
    const centerY = canvas?.height / 2;

    const animate = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);

      // Draw animated particles
      particles?.forEach((particle, index) => {
        if (isPlaying) {
          particle.angle += particle?.speed;
        }

        const x = centerX + Math.cos(particle?.angle) * particle?.radius;
        const y = centerY + Math.sin(particle?.angle) * particle?.radius;

        ctx?.beginPath();
        ctx?.arc(x, y, particle?.size, 0, Math.PI * 2);
        ctx.fillStyle = particle?.color;
        ctx.globalAlpha = particle?.opacity * (isPlaying ? 1 : 0.3);
        ctx?.fill();
      });

      // Draw spectrum visualization
      if (isPlaying && audioRef?.current) {
        drawSpectrum(ctx, centerX, centerY);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    };
  }, [particles, isPlaying, audioRef]);

  const drawSpectrum = (ctx, centerX, centerY) => {
    const bars = 32;
    const barWidth = 4;
    const radius = 200;

    for (let i = 0; i < bars; i++) {
      const angle = (i / bars) * Math.PI * 2;
      const barHeight = 20 + Math.random() * 40; // Mock spectrum data

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      ctx?.beginPath();
      ctx?.moveTo(x1, y1);
      ctx?.lineTo(x2, y2);
      ctx.strokeStyle = `hsl(${(i / bars) * 360}, 70%, 60%)`;
      ctx.lineWidth = barWidth;
      ctx.globalAlpha = 0.8;
      ctx?.stroke();
    }
  };

  const handleProgressClick = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect();
    const centerX = rect?.left + rect?.width / 2;
    const centerY = rect?.top + rect?.height / 2;
    const x = e?.clientX - centerX;
    const y = e?.clientY - centerY;

    const angle = Math.atan2(y, x);
    const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
    const newProgress = Math.max(0, Math.min(1, normalizedAngle));

    onProgressChange(newProgress);
  };

  const progressAngle = progress * 360 - 90;
  const circumference = 2 * Math.PI * 140;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* Background Canvas for Animations */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="absolute inset-0 pointer-events-none"
      />
      {/* Main Circular Player */}
      <div
        className="relative w-80 h-80 cursor-pointer group"
        onClick={handleProgressClick}
      >
        {/* Outer Glow Ring */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            isPlaying
              ? "shadow-[0_0_60px_rgba(99,102,241,0.6)] animate-pulse"
              : "shadow-[0_0_30px_rgba(99,102,241,0.3)]"
          }`}
        />

        {/* Progress Ring Background */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="rgba(99, 102, 241, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Ring */}
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300"
          />
          <defs>
            <linearGradient
              id="progressGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>

        {/* Album Art Container */}
        <div className="absolute inset-4 rounded-full overflow-hidden glass group-hover:scale-105 transition-transform duration-300">
          <div className="relative w-full h-full">
            {currentTrack?.artwork ? (
              <Image
                src={currentTrack?.artwork}
                alt={`${currentTrack?.title} artwork`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <div className="text-6xl text-white/80 animate-pulse">♪</div>
              </div>
            )}

            {/* Play/Pause Overlay */}
            <div
              className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div
                  className={`text-white text-2xl ${isPlaying ? "❚❚" : "▶"}`}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Indicators */}
        <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(progress * duration)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      {/* Floating Visual Effects */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isPlaying ? "opacity-100" : "opacity-50"
        }`}
      >
        {[...Array(8)]?.map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary ${
              isPlaying ? "animate-ping" : ""
            }`}
            style={{
              top: `${20 + Math.sin((i / 8) * Math.PI * 2) * 30}%`,
              left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 40}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: "2s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs?.toString()?.padStart(2, "0")}`;
};

export default CircularPlayer;
