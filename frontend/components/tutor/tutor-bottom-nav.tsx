'use client';

import { Mic, MessageSquare, BarChart3, ArrowLeft } from 'lucide-react';

interface TutorBottomNavProps {
  isListening: boolean;
  onMicToggle: () => void;
  onChatToggle: () => void;
  onBack: () => void;
  onProgress: () => void;
}

export function TutorBottomNav({ 
  isListening, 
  onMicToggle, 
  onChatToggle,
  onBack,
  onProgress 
}: TutorBottomNavProps) {
  return (
    <div className="flex justify-center px-3 pb-3 sm:px-4 sm:pb-4" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
      <nav className="glass-nav">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="nav-button"
          aria-label="Go back"
        >
          <ArrowLeft className="icon" />
        </button>

        {/* Mic Button with mute indicator */}
        <button
          onClick={onMicToggle}
          className={`nav-button mic-button ${isListening ? 'active' : ''}`}
          aria-label="Toggle microphone"
        >
          <div className="icon-container">
            <Mic className="icon" />
            {isListening && <div className="pulse-ring" />}
            {!isListening && <div className="mic-strike" />}
          </div>
        </button>

        {/* Chat Button */}
        <button
          onClick={onChatToggle}
          className="nav-button"
          aria-label="Open chat"
        >
          <MessageSquare className="icon" />
        </button>

        {/* Progress Button */}
        <button
          onClick={onProgress}
          className="nav-button"
          aria-label="View progress"
        >
          <BarChart3 className="icon" />
        </button>
      </nav>

      <style jsx>{`
        .glass-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 
            0 0 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          max-width: 260px;
          width: auto;
          height: 72px;
        }

        @media (min-width: 640px) {
          .glass-nav {
            gap: 20px;
            padding: 14px 20px;
            max-width: 280px;
          }
        }

        .nav-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .nav-button:hover {
          color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.05);
        }

        .nav-button:active {
          transform: scale(0.95);
        }

        .nav-button.active {
          color: #00ffff;
          background: rgba(0, 255, 255, 0.1);
        }

        .nav-button.mic-button:not(.active) {
          color: rgba(255, 77, 77, 0.9);
        }

        .icon {
          width: 22px;
          height: 22px;
        }

        .icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
        }

        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid #00ffff;
          animation: pulse-ring 1.5s ease-out infinite;
          pointer-events: none;
        }

        .mic-strike {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2.5px;
          height: 26px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            #ff4d4d 15%,
            #ff4d4d 85%,
            transparent 100%
          );
          transform: translate(-50%, -50%) rotate(-45deg);
          box-shadow: 0 0 6px rgba(255, 77, 77, 0.8);
          animation: strike-fade-in 150ms ease-out;
          pointer-events: none;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes strike-fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(-45deg) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(-45deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
