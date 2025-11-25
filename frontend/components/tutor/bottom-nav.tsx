'use client';

import { useRouter } from 'next/navigation';
import { Mic, MessageSquare, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  isListening: boolean;
  onMicToggle: () => void;
  onChatToggle: () => void;
}

export function BottomNav({ isListening, onMicToggle, onChatToggle }: BottomNavProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center px-4 pb-6">
      <nav className="glass-nav flex items-center gap-6 rounded-full px-8 py-4">
        {/* Mic Button */}
        <button
          onClick={onMicToggle}
          className={`nav-button ${isListening ? 'active' : ''}`}
          aria-label="Toggle microphone"
        >
          <Mic className="h-6 w-6" />
          {isListening && <div className="pulse-ring" />}
        </button>

        {/* Chat Button */}
        <button
          onClick={onChatToggle}
          className="nav-button"
          aria-label="Open chat"
        >
          <MessageSquare className="h-6 w-6" />
        </button>

        {/* Progress Button */}
        <button
          onClick={() => router.push('/progress')}
          className="nav-button"
          aria-label="View progress"
        >
          <BarChart3 className="h-6 w-6" />
        </button>
      </nav>

      <style jsx>{`
        .glass-nav {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .nav-button {
          position: relative;
          padding: 12px;
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .nav-button:hover {
          color: rgba(255, 255, 255, 1);
          background: rgba(255, 255, 255, 0.08);
          transform: scale(1.05);
        }

        .nav-button:active {
          transform: scale(0.98);
        }

        .nav-button.active {
          color: #00ffff;
          background: rgba(0, 255, 255, 0.1);
        }

        .pulse-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #00ffff;
          animation: pulse-ring 1.5s ease-out infinite;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
