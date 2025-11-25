'use client';

import { useEffect, useRef } from 'react';

export function AnimatedCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const drawCube = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = 60;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate
      rotation += 0.01;

      // 3D cube vertices
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ];

      // Rotate vertices
      const rotated = vertices.map(([x, y, z]) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotation);
        const sinY = Math.sin(rotation);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(rotation * 0.7);
        const sinX = Math.sin(rotation * 0.7);
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        return [x1, y1, z2];
      });

      // Project to 2D
      const projected = rotated.map(([x, y, z]) => {
        const scale = 200 / (200 + z * 50);
        return [
          centerX + x * size * scale,
          centerY + y * size * scale,
          z
        ];
      });

      // Draw edges with depth-based opacity
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // Back face
        [4, 5], [5, 6], [6, 7], [7, 4], // Front face
        [0, 4], [1, 5], [2, 6], [3, 7]  // Connecting edges
      ];

      edges.forEach(([start, end]) => {
        const [x1, y1, z1] = projected[start];
        const [x2, y2, z2] = projected[end];
        const avgZ = (z1 + z2) / 2;
        const opacity = 0.3 + (avgZ + 1) * 0.35;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pixel glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw vertices
      projected.forEach(([x, y, z]) => {
        const opacity = 0.5 + (z + 1) * 0.25;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(138, 43, 226, ${opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawCube);
    };

    drawCube();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      className="drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]"
    />
  );
}
