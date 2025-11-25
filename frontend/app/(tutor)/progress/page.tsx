'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { ProgressCard } from '@/components/tutor/progress-card';
import { SummaryCard } from '@/components/tutor/summary-card';
import { NeonLoader } from '@/components/tutor/neon-loader';

interface ConceptProgress {
  id: string;
  title: string;
  lastScore: number;
  attemptType: 'quiz' | 'teach_back';
  timestamp: string;
  averageScore: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<ConceptProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    highest: 0,
    lowest: 0,
    average: 0,
  });

  useEffect(() => {
    // Load from learner_history.json
    const loadProgress = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/progress');
        const data = await response.json();
        
        console.log('📊 Loaded progress data:', data);
        
        // Transform data
        const concepts: ConceptProgress[] = Object.entries(data.concepts || {}).map(([id, conceptData]: [string, any]) => {
          const attempts = conceptData.attempts || [];
          const lastAttempt = attempts[attempts.length - 1];
          
          return {
            id,
            title: id.charAt(0).toUpperCase() + id.slice(1),
            lastScore: lastAttempt?.current_score || 0,
            attemptType: lastAttempt?.mode || 'quiz',
            timestamp: lastAttempt?.timestamp || new Date().toISOString(),
            averageScore: conceptData.average_score || 0,
          };
        });

        setProgress(concepts);

        // Calculate summary
        if (concepts.length > 0) {
          const allScores = concepts.flatMap(c => {
            const conceptData = data.concepts[c.id];
            return (conceptData.attempts || []).map((a: any) => a.current_score);
          });
          
          if (allScores.length > 0) {
            setSummary({
              highest: Math.max(...allScores),
              lowest: Math.min(...allScores),
              average: allScores.reduce((a, b) => a + b, 0) / allScores.length,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
        setProgress([]);
        setSummary({ highest: 0, lowest: 0, average: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (isLoading) {
    return <NeonLoader message="Loading your progress..." />;
  }

  return (
    <div className="relative h-[100svh] w-full overflow-y-auto bg-[#0C0C0E]">
      {/* Animated pixel background */}
      <div className="absolute inset-0 opacity-10">
        <div className="pixel-grid-animated" />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

      {/* Content */}
      <div className="relative z-10 px-3 py-6 sm:px-4 sm:py-8">
        {/* Header */}
        <div className="mx-auto mb-6 flex max-w-4xl items-center sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs text-gray-400 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back
          </button>
          <h1 className="pixel-title flex-1 text-center text-xl font-bold text-white sm:text-2xl md:text-3xl">
            YOUR PROGRESS
          </h1>
          <div className="w-16 sm:w-20" /> {/* Spacer for centering */}
        </div>

        {/* Summary Card */}
        <div className="mx-auto mb-6 max-w-4xl sm:mb-8">
          <SummaryCard summary={summary} />
        </div>

        {/* Progress Cards Grid */}
        <div className="mx-auto max-w-4xl pb-6">
          {progress.length === 0 ? (
            <div className="glass-card rounded-lg p-8 text-center sm:p-12">
              <Award className="mx-auto mb-3 h-10 w-10 text-gray-600 sm:mb-4 sm:h-12 sm:w-12" />
              <p className="text-sm text-gray-400 sm:text-base">No progress yet. Start learning to see your stats!</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {progress.map((concept, index) => (
                <ProgressCard
                  key={concept.id}
                  concept={concept}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .pixel-grid-animated {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 16px 16px;
          width: 100%;
          height: 100%;
          animation: pixelFloat 30s linear infinite;
        }

        @keyframes pixelFloat {
          0% { transform: translate(0, 0); }
          100% { transform: translate(16px, 16px); }
        }

        .pixel-title {
          text-shadow: 
            2px 2px 0 rgba(0, 255, 255, 0.3),
            0 0 10px rgba(0, 255, 255, 0.2);
          font-family: 'Courier New', monospace;
          letter-spacing: 0.1em;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
