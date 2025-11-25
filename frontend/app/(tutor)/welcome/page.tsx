'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatedCube } from '@/components/tutor/animated-cube';
import { InterestingFact } from '@/components/tutor/interesting-fact';
import { NeonLoader } from '@/components/tutor/neon-loader';

const facts = [
  "Active recall is 50% more effective than passive reading!",
  "Teaching others is one of the best ways to learn.",
  "Spaced repetition helps move knowledge to long-term memory.",
  "The Feynman Technique: Explain concepts in simple terms.",
  "Practice testing improves retention by up to 30%."
];

export default function WelcomePage() {
  const router = useRouter();
  const [currentFact, setCurrentFact] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader briefly on initial load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % facts.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return <NeonLoader message="Initializing..." />;
  }

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-[#0C0C0E]">
      {/* Animated pixel background */}
      <div className="absolute inset-0 opacity-20">
        <div className="pixel-grid" />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" />

      {/* Main content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-4 py-6 sm:py-8">
        {/* Top section */}
        <div className="flex w-full flex-col items-center">
          {/* Animated Cube - with safe container */}
          <div className="mb-4 flex w-full items-center justify-center sm:mb-6">
            <div 
              className="relative flex items-center justify-center overflow-visible p-6 sm:p-8"
              style={{ 
                minHeight: '240px',
                maxWidth: '280px',
                width: '100%'
              }}
            >
              <AnimatedCube />
            </div>
          </div>

          {/* Title */}
          <h1 className="pixel-title mb-2 text-center text-3xl font-bold tracking-wider text-white sm:mb-3 sm:text-4xl md:text-5xl lg:text-6xl">
            TEACH-THE-TUTOR
          </h1>
          
          <p className="mb-4 max-w-md text-center text-sm text-gray-400 sm:mb-6 sm:text-base">
            Master programming concepts through active recall
          </p>

          {/* Interesting Facts Section */}
          <div className="w-full max-w-lg">
            <InterestingFact fact={facts[currentFact]} />
          </div>
        </div>

        {/* Bottom CTA - Fixed at bottom */}
        <div className="w-full pb-safe">
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/session')}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-10 py-3.5 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 sm:px-12 sm:py-4 sm:text-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Learning
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>

      {/* Pixel glow effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.08),transparent_50%)]" />

      <style jsx>{`
        .pixel-grid {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
          width: 100%;
          height: 100%;
          animation: pixelShift 20s linear infinite;
        }

        @keyframes pixelShift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(20px, 20px); }
        }

        .pixel-title {
          text-shadow: 
            2px 2px 0 rgba(0, 255, 255, 0.5),
            4px 4px 0 rgba(138, 43, 226, 0.3),
            0 0 20px rgba(0, 255, 255, 0.3);
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .pb-safe {
          padding-bottom: max(1rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </div>
  );
}
