'use client';

interface NeonLoaderProps {
  message?: string;
}

export function NeonLoader({ message = 'Loading...' }: NeonLoaderProps) {
  return (
    <div className="loader-container">
      {/* Neon Bouncing Dots */}
      <div className="dots-container">
        <div className="dot dot-1" />
        <div className="dot dot-2" />
        <div className="dot dot-3" />
      </div>

      {/* Loading Message */}
      {message && (
        <p className="loader-message">
          {message}
        </p>
      )}

      <style jsx>{`
        .loader-container {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          background: rgba(12, 12, 14, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 999;
        }

        .dots-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .dot {
          width: 16px;
          height: 16px;
          border-radius: 2px;
          animation: neon-bounce 1.4s ease-in-out infinite;
        }

        .dot-1 {
          background: #00E5FF;
          box-shadow: 
            0 0 12px rgba(0, 229, 255, 0.6),
            0 0 24px rgba(0, 229, 255, 0.3);
          animation-delay: 0s;
        }

        .dot-2 {
          background: #A855F7;
          box-shadow: 
            0 0 12px rgba(168, 85, 247, 0.6),
            0 0 24px rgba(168, 85, 247, 0.3);
          animation-delay: 0.2s;
        }

        .dot-3 {
          background: #28FFBF;
          box-shadow: 
            0 0 12px rgba(40, 255, 191, 0.6),
            0 0 24px rgba(40, 255, 191, 0.3);
          animation-delay: 0.4s;
        }

        @keyframes neon-bounce {
          0%, 60%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          30% {
            transform: translateY(-20px) scale(1.1);
            opacity: 1;
          }
        }

        .loader-message {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
          animation: pulse-text 2s ease-in-out infinite;
        }

        @keyframes pulse-text {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        /* Mobile optimization */
        @media (max-width: 640px) {
          .dots-container {
            gap: 10px;
            transform: scale(0.8);
          }

          .loader-message {
            font-size: 12px;
          }
        }

        /* Safe area for notched devices */
        @supports (padding: env(safe-area-inset-top)) {
          .loader-container {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>
    </div>
  );
}
