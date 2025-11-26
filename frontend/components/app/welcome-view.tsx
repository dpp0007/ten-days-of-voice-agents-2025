import { AnimatedGrid } from "@/components/app/animated-grid";

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <>
      <div ref={ref} className="welcome-container">
        {/* Animated Grid Pattern */}
        <AnimatedGrid />
        
        {/* Main Content */}
        <div className="content-wrapper">
          {/* Logo/Icon */}
          <div className="logo-container">
            <svg className="logo-icon" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>

          {/* Hero Title */}
          <h1 className="hero-title">B2B Lead Generator</h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle">
            AI-Powered SDR Agent. Let's qualify your next big opportunity.
          </p>

          {/* CTA Button */}
          <button className="cta-button" onClick={onStartCall}>
            <span className="button-text">Start Conversation</span>
            <svg className="arrow-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Feature Badges */}
          <div className="feature-badges">
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Real-time</span>
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              </svg>
              <span>Natural voice</span>
            </div>
            <div className="badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7h-9"/>
                <path d="M14 17H5"/>
                <circle cx="17" cy="17" r="3"/>
                <circle cx="7" cy="7" r="3"/>
              </svg>
              <span>Powered by Murf</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }

        /* Logo Container */
        .logo-container {
          margin-bottom: 48px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .logo-icon {
          stroke: #f58634;
          filter: drop-shadow(0 10px 30px rgba(245, 134, 52, 0.3));
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        /* Typography */
        .hero-title {
          font-size: 56px;
          font-weight: 700;
          color: #2A2A2A;
          margin: 0 0 20px 0;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 20px;
          color: rgba(42, 42, 42, 0.6);
          line-height: 1.6;
          margin: 0 0 48px 0;
          max-width: 480px;
          font-weight: 400;
        }

        /* CTA Button - B2B Lead Generator Theme */
        .cta-button {
          padding: 22px 52px;
          background: #f58634;
          color: #ffffff;
          border: none;
          border-radius: 100px;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 
            0 8px 32px rgba(245, 134, 52, 0.3),
            0 4px 16px rgba(0, 0, 0, 0.1);
          transition: all 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }

        .button-text {
          position: relative;
          z-index: 2;
          font-weight: 700;
        }

        /* Frosted glass shimmer effect */
        .cta-button::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 100px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(139, 69, 19, 0.1) 50%,
            rgba(255, 255, 255, 0.3) 100%
          );
          opacity: 0.6;
          transition: opacity 500ms ease;
          pointer-events: none;
        }

        /* Animated light sweep */
        .cta-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 80%;
          height: 200%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          transform: skewX(-25deg);
          animation: glass-shine 4s ease-in-out infinite;
        }

        @keyframes glass-shine {
          0%, 100% {
            left: -100%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            left: 150%;
            opacity: 0.8;
          }
          100% {
            left: 150%;
            opacity: 0;
          }
        }

        /* Hover state */
        .cta-button:hover {
          transform: translateY(-8px) scale(1.05);
          background: #ff9447;
          box-shadow: 
            0 16px 48px rgba(245, 134, 52, 0.4),
            0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .cta-button:hover::before {
          opacity: 0.9;
        }

        .cta-button:hover .arrow-icon {
          transform: translateX(8px) rotate(0deg);
          animation: arrow-bounce 0.6s ease-in-out infinite;
        }

        @keyframes arrow-bounce {
          0%, 100% {
            transform: translateX(8px) rotate(0deg);
          }
          50% {
            transform: translateX(12px) rotate(0deg);
          }
        }

        /* Active/pressed state */
        .cta-button:active {
          transform: translateY(-2px) scale(1.02);
          background: #e67a2e;
          box-shadow: 
            0 4px 20px rgba(245, 134, 52, 0.25),
            inset 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* Focus state for accessibility */
        .cta-button:focus-visible {
          outline: 3px solid rgba(245, 134, 52, 0.5);
          outline-offset: 5px;
        }

        /* Unique arrow icon with animation */
        .arrow-icon {
          transition: all 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          stroke-width: 2.5;
          position: relative;
          z-index: 2;
        }

        /* Breathing glow animation */
        @keyframes glass-glow {
          0%, 100% {
            box-shadow: 
              0 8px 32px rgba(245, 134, 52, 0.3),
              0 4px 16px rgba(0, 0, 0, 0.1);
          }
          50% {
            box-shadow: 
              0 12px 40px rgba(245, 134, 52, 0.4),
              0 6px 20px rgba(0, 0, 0, 0.12);
          }
        }

        .cta-button {
          animation: glass-glow 4s ease-in-out infinite;
        }

        /* Feature Badges */
        .feature-badges {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          font-size: 14px;
          color: #2A2A2A;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: badge-float 3s ease-in-out infinite;
        }

        .badge:nth-child(1) {
          animation-delay: 0s;
        }

        .badge:nth-child(2) {
          animation-delay: 0.5s;
        }

        .badge:nth-child(3) {
          animation-delay: 1s;
        }

        @keyframes badge-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .badge svg {
          color: #f58634;
        }

        /* Responsive - Mobile Optimized */
        @media (max-width: 768px) {
          .welcome-container {
            padding: 24px 20px;
            justify-content: center;
          }

          .content-wrapper {
            margin: 0;
            padding: 0;
          }

          .logo-container {
            margin-bottom: 36px;
          }

          .logo-icon {
            width: 100px;
            height: 100px;
          }

          .hero-title {
            font-size: 38px;
          }

          .hero-subtitle {
            font-size: 17px;
            margin-bottom: 36px;
          }

          .cta-button {
            padding: 16px 32px;
            font-size: 16px;
          }

          .feature-badges {
            gap: 12px;
          }

          .badge {
            padding: 10px 16px;
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .welcome-container {
            padding: 20px 16px;
          }

          .content-wrapper {
            max-width: 100%;
          }

          .logo-container {
            margin-bottom: 28px;
          }

          .logo-icon {
            width: 80px;
            height: 80px;
          }

          .hero-title {
            font-size: 32px;
            margin-bottom: 16px;
          }

          .hero-subtitle {
            font-size: 16px;
            margin-bottom: 32px;
            padding: 0 8px;
          }

          .cta-button {
            margin-bottom: 32px;
          }

          .feature-badges {
            gap: 10px;
          }

          .badge {
            padding: 8px 14px;
            font-size: 12px;
          }

          .badge svg {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </>
  );
};
