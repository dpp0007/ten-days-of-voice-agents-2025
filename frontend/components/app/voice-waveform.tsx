'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useVoiceAssistant } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface VoiceWaveformProps {
  className?: string;
}

export function VoiceWaveform({ className }: VoiceWaveformProps) {
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    // Setup audio analysis with better smoothing
    if (audioTrack?.publication.track) {
      const stream = new MediaStream([audioTrack.publication.track.mediaStreamTrack]);
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256; // Increased for smoother analysis
      analyserRef.current.smoothingTimeConstant = 0.85; // Added smoothing
      source.connect(analyserRef.current);
      dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }

    const barCount = 60;
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.55;
    const maxBarHeight = radius * 0.5;
    let time = 0;
    
    // Smoothing arrays for each bar
    const barHeights = new Array(barCount).fill(0);
    const targetHeights = new Array(barCount).fill(0);

    // Elegant wave pattern generator
    const getWavePattern = (index: number, time: number, frequency: number = 1) => {
      const wave1 = Math.sin(time * frequency + index * 0.2);
      const wave2 = Math.sin(time * frequency * 2 + index * 0.4) * 0.5;
      const wave3 = Math.sin(time * frequency * 0.5 + index * 0.1) * 0.3;
      return (wave1 + wave2 + wave3) / 1.8;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      time += 0.015; // Slower progression

      for (let i = 0; i < barCount; i++) {
        let lineWidth = 1.5;
        let opacity = 0.4;

        if (isSpeaking && analyserRef.current && dataArrayRef.current) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const dataIndex = Math.floor((i / barCount) * dataArrayRef.current.length);
          const audioLevel = dataArrayRef.current[dataIndex] / 255;
          
          // Audio-reactive with subtle wave influence
          const wavePattern = getWavePattern(i, time, 1.5); // Slower frequency
          targetHeights[i] = (audioLevel * 0.7 + Math.abs(wavePattern) * 0.3) * maxBarHeight;
          lineWidth = 1.5 + audioLevel * 1.2; // Reduced variation
          opacity = 0.4 + audioLevel * 0.5; // Reduced variation
        } else if (isListening) {
          // Gentle breathing pattern
          const wavePattern = getWavePattern(i, time, 1.2); // Slower
          targetHeights[i] = Math.abs(wavePattern) * 10 + 4; // Reduced amplitude
          lineWidth = 1.5 + Math.abs(wavePattern) * 0.6; // Reduced variation
          opacity = 0.3 + Math.abs(wavePattern) * 0.35; // Reduced variation
        } else {
          // Minimal idle pattern
          const wavePattern = getWavePattern(i, time, 0.6); // Slower
          targetHeights[i] = Math.abs(wavePattern) * 5 + 2; // Reduced amplitude
          lineWidth = 1.5;
          opacity = 0.2 + Math.abs(wavePattern) * 0.15; // Reduced variation
        }

        // Smooth transition to target height
        barHeights[i] += (targetHeights[i] - barHeights[i]) * 0.12; // Smooth interpolation
        const barHeight = barHeights[i];

        // Calculate position in circle
        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2; // Start from top
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        // Bar extends outward from circle
        const outerX = centerX + Math.cos(angle) * (radius + barHeight);
        const outerY = centerY + Math.sin(angle) * (radius + barHeight);

        // Create elegant gradient
        const gradient = ctx.createLinearGradient(x, y, outerX, outerY);
        
        if (isSpeaking) {
          gradient.addColorStop(0, `rgba(0, 255, 255, ${opacity * 0.2})`);
          gradient.addColorStop(0.6, `rgba(0, 255, 255, ${opacity})`);
          gradient.addColorStop(1, `rgba(0, 255, 255, ${opacity * 0.1})`);
        } else if (isListening) {
          gradient.addColorStop(0, `rgba(180, 100, 255, ${opacity * 0.2})`);
          gradient.addColorStop(0.6, `rgba(180, 100, 255, ${opacity})`);
          gradient.addColorStop(1, `rgba(180, 100, 255, ${opacity * 0.1})`);
        } else {
          gradient.addColorStop(0, `rgba(100, 200, 255, ${opacity * 0.2})`);
          gradient.addColorStop(0.6, `rgba(100, 200, 255, ${opacity})`);
          gradient.addColorStop(1, `rgba(100, 200, 255, ${opacity * 0.1})`);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(outerX, outerY);
        ctx.stroke();
      }

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
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn('relative overflow-visible', className)}
    >
      <canvas
        ref={canvasRef}
        className="relative h-full w-full"
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
}
