'use client';

import { TrendingUp, TrendingDown, Target } from 'lucide-react';

interface SummaryCardProps {
  summary: {
    highest: number;
    lowest: number;
    average: number;
  };
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <div className="summary-card group relative">
      {/* Pixel corners */}
      <div className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-cyan-500" />
      <div className="absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-purple-500" />
      <div className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-purple-500" />
      <div className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-cyan-500" />

      {/* Content */}
      <div className="relative grid gap-4 sm:grid-cols-3 sm:gap-6">
        {/* Highest Score */}
        <div className="stat-item">
          <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
            <div className="rounded-full bg-green-500/10 p-1.5 sm:p-2">
              <TrendingUp className="h-4 w-4 text-green-400 sm:h-5 sm:w-5" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
              Highest
            </span>
          </div>
          <div className="text-3xl font-bold text-green-400 sm:text-4xl">
            {summary.highest}
          </div>
        </div>

        {/* Average Score */}
        <div className="stat-item">
          <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
            <div className="rounded-full bg-cyan-500/10 p-1.5 sm:p-2">
              <Target className="h-4 w-4 text-cyan-400 sm:h-5 sm:w-5" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
              Average
            </span>
          </div>
          <div className="text-3xl font-bold text-cyan-400 sm:text-4xl">
            {summary.average.toFixed(1)}
          </div>
        </div>

        {/* Lowest Score */}
        <div className="stat-item">
          <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
            <div className="rounded-full bg-yellow-500/10 p-1.5 sm:p-2">
              <TrendingDown className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" />
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 sm:text-sm">
              Lowest
            </span>
          </div>
          <div className="text-3xl font-bold text-yellow-400 sm:text-4xl">
            {summary.lowest}
          </div>
        </div>
      </div>

      <style jsx>{`
        .summary-card {
          padding: 20px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 2px solid rgba(0, 255, 255, 0.2);
          box-shadow: 
            0 12px 48px rgba(0, 255, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .summary-card {
            padding: 28px;
            border-radius: 16px;
          }
        }

        .summary-card:hover {
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 
            0 16px 64px rgba(0, 255, 255, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .stat-item {
          transition: transform 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
