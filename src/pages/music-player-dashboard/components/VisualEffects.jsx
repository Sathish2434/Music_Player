import React, { useEffect, useRef } from 'react';

const VisualEffects = ({ isPlaying, currentTime, audioData }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    const centerX = canvas?.width / 2;
    const centerY = canvas?.height / 2;

    const particles = [];
    const particleCount = 50;
    

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles?.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 100,
        maxLife: 100,
        size: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);

      if (isPlaying) {
        // Update and draw particles
        particles?.forEach((particle, index) => {
          // Update position
          particle.x += particle?.vx;
          particle.y += particle?.vy;
          particle.angle += 0.02;
          
          // Add circular motion
          const radius = 100 + Math.sin(currentTime * 0.001 + index * 0.1) * 50;
          particle.x = centerX + Math.cos(particle?.angle) * radius;
          particle.y = centerY + Math.sin(particle?.angle) * radius;

          // Update life
          particle.life -= 1;
          if (particle?.life <= 0) {
            particle.life = particle?.maxLife;
            particle.x = centerX;
            particle.y = centerY;
            particle.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
          }

          // Draw particle
          const alpha = particle?.life / particle?.maxLife;
          ctx?.save();
          ctx.globalAlpha = alpha * 0.7;
          ctx.fillStyle = particle?.color;
          ctx?.beginPath();
          ctx?.arc(particle?.x, particle?.y, particle?.size, 0, Math.PI * 2);
          ctx?.fill();
          ctx?.restore();
        });

        // Draw geometric patterns
        ctx?.save();
        ctx?.translate(centerX, centerY);
        
        // Rotating rings
        for (let i = 0; i < 3; i++) {
          ctx?.save();
          ctx?.rotate(currentTime * 0.001 * (i + 1));
          ctx.strokeStyle = `hsla(${(currentTime * 0.1 + i * 120) % 360}, 70%, 60%, 0.3)`;
          ctx.lineWidth = 2;
          ctx?.beginPath();
          ctx?.arc(0, 0, 150 + i * 30, 0, Math.PI * 2);
          ctx?.stroke();
          ctx?.restore();
        }

        // Pulsing center glow
        const glowRadius = 80 + Math.sin(currentTime * 0.003) * 20;
        const gradient = ctx?.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
        gradient?.addColorStop(0, `hsla(${(currentTime * 0.1) % 360}, 70%, 60%, 0.1)`);
        gradient?.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx?.beginPath();
        ctx?.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx?.fill();

        ctx?.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef?.current) {
        cancelAnimationFrame(animationRef?.current);
      }
    };
  }, [isPlaying, currentTime]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 opacity-60"
      />
      
      {/* Additional CSS-based effects */}
      {isPlaying && (
        <>
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-primary/40 rotate-45 animate-rotate-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-secondary/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/6 w-4 h-8 bg-accent/40 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 right-1/6 w-10 h-10 border border-primary/30 rounded-full animate-rotate-slow" style={{ animationDelay: '3s' }}></div>
          
          {/* Gradient orbs */}
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        </>
      )}
    </div>
  );
};

export default VisualEffects;