'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useVoiceAssistant } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface AnimatedSphereProps {
  className?: string;
}

export function AnimatedSphere({ className }: AnimatedSphereProps) {
  const { state, audioTrack } = useVoiceAssistant();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();

  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.45;

    let time = 0;
    let audioLevel = 0;
    let targetAudioLevel = 0;
    let smoothedRadius = baseRadius;

    // Setup audio analysis
    if (audioTrack?.publication.track) {
      const stream = new MediaStream([audioTrack.publication.track.mediaStreamTrack]);
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048; // Increased for smoother analysis
      analyserRef.current.smoothingTimeConstant = 0.9; // Increased smoothing
      source.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Get audio level with aggressive smoothing
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Use only lower frequencies for smoother response
        const relevantData = dataArrayRef.current.slice(0, Math.floor(dataArrayRef.current.length / 4));
        const sum = relevantData.reduce((a, b) => a + b, 0);
        targetAudioLevel = (sum / relevantData.length) / 255;
        
        // Multi-stage smoothing for ultra-smooth transitions
        audioLevel += (targetAudioLevel - audioLevel) * 0.08; // Reduced from 0.15
      } else {
        audioLevel *= 0.98; // Slower decay
      }

      time += 0.008; // Slower time progression

      // Calculate sphere properties based on state
      let targetRadius = baseRadius;
      let glowIntensity = 0.3;
      let color1, color2, color3;

      if (isSpeaking) {
        // Cyan theme for speaking
        targetRadius = baseRadius * (1 + audioLevel * 0.2); // Reduced from 0.25
        glowIntensity = 0.5 + audioLevel * 0.4; // Reduced from 0.5
        color1 = { r: 0, g: 255, b: 255 };
        color2 = { r: 0, g: 200, b: 255 };
        color3 = { r: 0, g: 150, b: 255 };
      } else if (isListening) {
        // Purple theme for listening
        const breathe = Math.sin(time * 1.2) * 0.5 + 0.5; // Slower breathing
        targetRadius = baseRadius * (1 + breathe * 0.06); // Reduced from 0.08
        glowIntensity = 0.4 + breathe * 0.25; // Reduced from 0.3
        color1 = { r: 180, g: 100, b: 255 };
        color2 = { r: 138, g: 43, b: 226 };
        color3 = { r: 100, g: 50, b: 200 };
      } else {
        // Blue theme for idle
        const breathe = Math.sin(time * 0.8) * 0.5 + 0.5; // Slower breathing
        targetRadius = baseRadius * (1 + breathe * 0.03); // Reduced from 0.04
        glowIntensity = 0.25 + breathe * 0.12; // Reduced from 0.15
        color1 = { r: 100, g: 200, b: 255 };
        color2 = { r: 50, g: 150, b: 255 };
        color3 = { r: 0, g: 100, b: 200 };
      }

      // Smooth radius transitions
      smoothedRadius += (targetRadius - smoothedRadius) * 0.1;
      const radius = smoothedRadius;

      // Draw soft outer glow (atmospheric)
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.5,
        centerX, centerY, radius * 2.5
      );
      glowGradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, ${glowIntensity * 0.3})`);
      glowGradient.addColorStop(0.4, `rgba(${color2.r}, ${color2.g}, ${color2.b}, ${glowIntensity * 0.15})`);
      glowGradient.addColorStop(0.7, `rgba(${color3.r}, ${color3.g}, ${color3.b}, ${glowIntensity * 0.05})`);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw main sphere with glass-like gradient
      const sphereGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );

      sphereGradient.addColorStop(0, `rgba(${color1.r}, ${color1.g}, ${color1.b}, 0.9)`);
      sphereGradient.addColorStop(0.5, `rgba(${color2.r}, ${color2.g}, ${color2.b}, 0.7)`);
      sphereGradient.addColorStop(1, `rgba(${color3.r}, ${color3.g}, ${color3.b}, 0.4)`);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGradient;
      ctx.fill();

      // Add subtle edge highlight
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 0.3})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add inner glow for depth
      const innerGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius * 0.6
      );
      innerGlow.addColorStop(0, `rgba(255, 255, 255, ${glowIntensity * 0.4})`);
      innerGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = innerGlow;
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isSpeaking, isListening, audioTrack]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative', className)}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
}
