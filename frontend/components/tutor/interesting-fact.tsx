'use client';

interface InterestingFactProps {
  fact: string;
}

export function InterestingFact({ fact }: InterestingFactProps) {
  return (
    <div className="group relative animate-fade-in">
      {/* Pixel corners */}
      <div className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-cyan-500" />
      <div className="absolute -right-2 -top-2 h-4 w-4 border-r-2 border-t-2 border-purple-500" />
      <div className="absolute -bottom-2 -left-2 h-4 w-4 border-b-2 border-l-2 border-purple-500" />
      <div className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-cyan-500" />

      {/* Glass card */}
      <div className="glass-card rounded-lg p-6 transition-all duration-300 group-hover:scale-[1.02]">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Did you know?
          </span>
        </div>
        <p className="text-base leading-relaxed text-gray-300">
          {fact}
        </p>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
