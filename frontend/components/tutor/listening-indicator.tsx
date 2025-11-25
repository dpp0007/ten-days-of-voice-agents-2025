'use client';

interface ListeningIndicatorProps {
  mode: 'learn' | 'quiz' | 'teach_back' | null;
  isListening: boolean;
  isAISpeaking: boolean;
}

export function ListeningIndicator({ mode, isListening, isAISpeaking }: ListeningIndicatorProps) {
  const getModeColor = () => {
    switch (mode) {
      case 'learn': return 'bg-blue-500';
      case 'quiz': return 'bg-green-500';
      case 'teach_back': return 'bg-purple-500';
      default: return 'bg-cyan-500';
    }
  };

  const getModeName = () => {
    switch (mode) {
      case 'learn': return 'Learn Mode';
      case 'quiz': return 'Quiz Mode';
      case 'teach_back': return 'Teach-Back Mode';
      default: return 'Ready';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Mode label */}
      <div className="glass-pill px-3 py-1">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {getModeName()}
        </span>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`dot ${getModeColor()} ${isListening || isAISpeaking ? 'animate' : ''}`}
            style={{
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .glass-pill {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          transition: all 0.4s ease-in-out;
        }

        .dot.animate {
          animation: pulse-grow 1.2s ease-in-out infinite;
        }

        @keyframes pulse-grow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.4);
            opacity: 1;
            box-shadow: 0 0 12px currentColor;
          }
        }
      `}</style>
    </div>
  );
}
