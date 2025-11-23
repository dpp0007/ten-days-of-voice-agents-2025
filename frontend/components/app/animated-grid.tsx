"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Detect mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    // Set canvas size with device pixel ratio for crisp rendering
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      return checkMobile();
    };

    let mobile = resizeCanvas();
    window.addEventListener("resize", () => {
      mobile = resizeCanvas();
    });

    // Responsive grid settings - Reduced density
    const getGridSize = () => (mobile ? 30 : 20);
    let gridSize = getGridSize();

    // Performance optimization: cache grid points
    let gridPoints: { x: number; y: number }[][] = [];
    let lastGridSize = gridSize;

    const updateGridPoints = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      const cols = Math.ceil(w / gridSize) + 2;
      const rows = Math.ceil(h / gridSize) + 2;

      gridPoints = [];
      for (let i = 0; i < cols; i++) {
        gridPoints[i] = [];
        for (let j = 0; j < rows; j++) {
          gridPoints[i][j] = {
            x: i * gridSize,
            y: j * gridSize,
          };
        }
      }
      lastGridSize = gridSize;
    };

    updateGridPoints();

    // Time-based animation for smooth frame-independent movement
    let lastTime = performance.now();
    let globalTime = 0;

    function drawGrid(currentTime: number) {
      if (!ctx || !canvas) return;

      const deltaTime = (currentTime - lastTime) / 16.67; // Normalize to 60fps
      lastTime = currentTime;
      globalTime += deltaTime * 0.01;

      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      // Update grid size if mobile state changed
      const newGridSize = getGridSize();
      if (newGridSize !== lastGridSize) {
        gridSize = newGridSize;
        updateGridPoints();
      }

      ctx.clearRect(0, 0, w, h);

      const cols = gridPoints.length;
      const rows = gridPoints[0]?.length || 0;

      // Simple wave parameters
      const waveAmplitude = mobile ? 3 : 5;
      const waveFrequency = 0.015;
      const waveSpeed = 0.5;

      // Draw vertical lines with simple wave
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.10)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < cols; i++) {
        ctx.beginPath();

        for (let j = 0; j < rows; j++) {
          const baseX = gridPoints[i][j].x;
          const baseY = gridPoints[i][j].y;

          // Simple sine wave offset
          const waveOffset = Math.sin(globalTime * waveSpeed + baseY * waveFrequency) * waveAmplitude;
          const finalX = baseX + waveOffset;
          const finalY = baseY;

          if (j === 0) {
            ctx.moveTo(finalX, finalY);
          } else {
            ctx.lineTo(finalX, finalY);
          }
        }

        ctx.stroke();
      }

      // Draw horizontal lines with simple wave
      for (let j = 0; j < rows; j++) {
        ctx.beginPath();

        for (let i = 0; i < cols; i++) {
          const baseX = gridPoints[i][j].x;
          const baseY = gridPoints[i][j].y;

          // Simple cosine wave offset (perpendicular to vertical)
          const waveOffset = Math.cos(globalTime * waveSpeed + baseX * waveFrequency) * waveAmplitude;
          const finalX = baseX;
          const finalY = baseY + waveOffset;

          if (i === 0) {
            ctx.moveTo(finalX, finalY);
          } else {
            ctx.lineTo(finalX, finalY);
          }
        }

        ctx.stroke();
      }
    }

    // Animation loop with requestAnimationFrame
    let animationId: number;
    function animate(currentTime: number) {
      drawGrid(currentTime);
      animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
