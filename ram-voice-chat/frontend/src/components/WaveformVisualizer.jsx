import React, { useEffect, useRef } from 'react';
import './WaveformVisualizer.css';

const WaveformVisualizer = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const barsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const barCount = 20;
    const bars = Array.from({ length: barCount }, () => ({
      height: Math.random() * 0.5,
      targetHeight: Math.random() * 1,
    }));

    barsRef.current = bars;

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(10, 25, 50, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      const barWidth = canvas.width / barCount;
      const gap = barWidth * 0.2;

      bars.forEach((bar, index) => {
        // Update bar height with smooth animation
        bar.targetHeight = Math.random() * 1;
        bar.height += (bar.targetHeight - bar.height) * 0.1;

        // Calculate position
        const x = index * barWidth + gap / 2;
        const barHeight = bar.height * (canvas.height * 0.6);

        // Draw bar with gradient
        const gradient = ctx.createLinearGradient(
          x,
          centerY - barHeight,
          x,
          centerY + barHeight
        );

        // Holographic gradient colors
        gradient.addColorStop(0, 'rgba(0, 255, 200, 0.8)');
        gradient.addColorStop(0.5, 'rgba(0, 100, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(200, 0, 255, 0.8)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, centerY - barHeight, barWidth - gap, barHeight * 2);

        // Glow effect
        ctx.shadowColor = 'rgba(0, 255, 200, 0.5)';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, centerY - barHeight, barWidth - gap, barHeight * 2);
      });

      ctx.shadowColor = 'transparent';
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="waveform-container">
      <canvas
        ref={canvasRef}
        className="waveform-canvas"
        width={400}
        height={120}
      ></canvas>
    </div>
  );
};

export default WaveformVisualizer;
