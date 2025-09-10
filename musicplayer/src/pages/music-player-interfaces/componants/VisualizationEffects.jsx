import React, { useRef, useEffect, useState } from "react";

const VisualizationEffects = ({ isPlaying, audioRef }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (audioRef?.current && !audioContext) {
      try {
        const context = new (window.AudioContext ||
          window.webkitAudioContext)();
        const analyserNode = context?.createAnalyser();
        const source = context?.createMediaElementSource(audioRef?.current);

        source?.connect(analyserNode);
        analyserNode?.connect(context?.destination);

        analyserNode.fftSize = 256;
        const bufferLength = analyserNode?.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        setAudioContext(context);
        setAnalyser(analyserNode);
        setDataArray(dataArray);
      } catch (error) {
        console.warn("Web Audio API not supported:", error);
      }
    }
  }, [audioRef?.current]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas || !analyser || !dataArray) return;

    const ctx = canvas?.getContext("2d");
    const width = canvas?.width;
    const height = canvas?.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const animate = () => {
      ctx?.clearRect(0, 0, width, height);

      if (isPlaying && analyser) {
        analyser?.getByteFrequencyData(dataArray);
        drawCircularSpectrum(ctx, centerX, centerY, dataArray);
        drawWaveform(ctx, centerX, centerY, dataArray);
        drawParticles(ctx, centerX, centerY, dataArray);
      } else {
        drawStaticEffects(ctx, centerX, centerY);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    };
  }, [isPlaying, analyser, dataArray]);

  const drawCircularSpectrum = (ctx, centerX, centerY, data) => {
    const radius = 250;
    const barCount = data?.length / 2;

    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const barHeight = (data?.[i] / 255) * 60;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const hue = (i / barCount) * 360;
      ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      ctx?.beginPath();
      ctx?.moveTo(x1, y1);
      ctx?.lineTo(x2, y2);
      ctx?.stroke();
    }
  };

  const drawWaveform = (ctx, centerX, centerY, data) => {
    const radius = 200;
    const points = 64;

    ctx?.beginPath();
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const amplitude = ((data?.[i] || 0) / 255) * 30;
      const x = centerX + Math.cos(angle) * (radius + amplitude);
      const y = centerY + Math.sin(angle) * (radius + amplitude);

      if (i === 0) {
        ctx?.moveTo(x, y);
      } else {
        ctx?.lineTo(x, y);
      }
    }
    ctx?.closePath();

    const gradient = ctx?.createRadialGradient(
      centerX,
      centerY,
      radius - 20,
      centerX,
      centerY,
      radius + 40
    );
    gradient?.addColorStop(0, "rgba(99, 102, 241, 0.3)");
    gradient?.addColorStop(0.5, "rgba(139, 92, 246, 0.2)");
    gradient?.addColorStop(1, "rgba(245, 158, 11, 0.1)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx?.stroke();
  };

  const drawParticles = (ctx, centerX, centerY, data) => {
    const particleCount = 20;
    const time = Date.now() * 0.001;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time;
      const intensity = (data?.[i * 4] || 0) / 255;
      const radius = 300 + intensity * 50;
      const size = 2 + intensity * 4;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx?.beginPath();
      ctx?.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(i / particleCount) * 360}, 70%, 60%, ${
        0.3 + intensity * 0.7
      })`;
      ctx?.fill();

      // Add glow effect
      ctx.shadowColor = `hsl(${(i / particleCount) * 360}, 70%, 60%)`;
      ctx.shadowBlur = 10;
      ctx?.fill();
      ctx.shadowBlur = 0;
    }
  };

  const drawStaticEffects = (ctx, centerX, centerY) => {
    const time = Date.now() * 0.001;
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time * 0.2;
      const radius = 280 + Math.sin(time + i) * 20;
      const size = 1 + Math.sin(time * 2 + i) * 1;

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx?.beginPath();
      ctx?.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${(i / particleCount) * 360}, 50%, 50%, 0.3)`;
      ctx?.fill();
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="w-full h-full"
        style={{ filter: "blur(0.5px)" }}
      />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />
      {/* Floating Orbs */}
      {isPlaying && (
        <div className="absolute inset-0">
          {[...Array(6)]?.map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary opacity-60 animate-float"
              style={{
                top: `${20 + Math.sin(i) * 60}%`,
                left: `${20 + Math.cos(i) * 60}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VisualizationEffects;
