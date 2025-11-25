'use client';

import { Brain, MessageSquare } from 'lucide-react';

interface ConceptProgress {
  id: string;
  title: string;
  lastScore: number;
  attemptType: 'quiz' | 'teach_back';
  timestamp: string;
  averageScore: number;
}

interface ProgressCardProps {
  concept: ConceptProgress;
  index: number;
}

export function ProgressCard({ concept, index }: ProgressCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="progress-card group"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Pixel corner */}
      <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-cyan-500/50" />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-base font-semibold text-white sm:text-lg">{concept.title}</h3>
          <div className={`text-xl font-bold sm:text-2xl ${getScoreColor(concept.lastScore)}`}>
            {concept.lastScore}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-2.5 space-y-1.5 sm:mb-3 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-500">Average</span>
            <span className="font-medium text-gray-300">{concept.averageScore.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-500">Type</span>
            <div className="flex items-center gap-1">
              {concept.attemptType === 'quiz' ? (
                <Brain className="h-3 w-3 text-green-400" />
              ) : (
                <MessageSquare className="h-3 w-3 text-purple-400" />
              )}
              <span className="font-medium capitalize text-gray-300">
                {concept.attemptType === 'teach_back' ? 'Teach-back' : 'Quiz'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 pt-2 sm:pt-3">
          <span className="text-xs text-gray-600">
            Last: {formatDate(concept.timestamp)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5 sm:mt-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${concept.averageScore}%` }}
          />
        </div>
      </div>

      <style jsx>{`
        .progress-card {
          position: relative;
          padding: 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
          animation: fade-in-right 0.5s ease-out both;
        }

        @media (min-width: 640px) {
          .progress-card {
            padding: 20px;
          }
        }

        .progress-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(0, 255, 255, 0.2);
          box-shadow: 
            0 12px 32px rgba(0, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        @media (hover: none) {
          .progress-card:active {
            transform: scale(0.98);
            background: rgba(255, 255, 255, 0.06);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
