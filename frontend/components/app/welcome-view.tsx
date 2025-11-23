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
          {/* Animated Coffee Cup */}
          <div className="coffee-cup-container">
            <div className="coffee-cup">
              <div className="cup-rim"></div>
              <div className="coffee-surface">
                <div className="ripple ripple-1"></div>
                <div className="ripple ripple-2"></div>
                <div className="ripple ripple-3"></div>
              </div>
              <div className="steam steam-1"></div>
              <div className="steam steam-2"></div>
              <div className="steam steam-3"></div>
            </div>
          </div>

          {/* Hero Title */}
          <h1 className="hero-title">Blue Tokai BrewBot</h1>
          
          {/* Subtitle */}
          <p className="hero-subtitle">
            Your virtual barista. Order coffee in English or Hindi.
          </p>

          {/* CTA Button */}
          <button className="cta-button" onClick={onStartCall}>
            <span className="button-text">Brew Coffee</span>
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
          background: linear-gradient(180deg, #12B1C5 0%, #8FE4F9 50%, #FFF9EF 100%);
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

        /* Coffee Cup Animation - Professional Design */
        .coffee-cup-container {
          margin-bottom: 48px;
          animation: float 4s ease-in-out infinite;
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
          transition: transform 0.3s ease;
        }

        .coffee-cup-container:hover {
          animation-play-state: paused;
          transform: scale(1.05) translateY(-5px);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-12px) rotate(-1deg);
          }
          50% {
            transform: translateY(-8px) rotate(0deg);
          }
          75% {
            transform: translateY(-12px) rotate(1deg);
          }
        }

        .coffee-cup {
          width: 200px;
          height: 200px;
          position: relative;
          transform-style: preserve-3d;
          animation: subtle-rotate 20s ease-in-out infinite;
        }

        @keyframes subtle-rotate {
          0%, 100% {
            transform: perspective(1000px) rotateY(0deg);
          }
          50% {
            transform: perspective(1000px) rotateY(5deg);
          }
        }

        /* Cup Rim - Enhanced 3D Effect */
        .cup-rim {
          position: absolute;
          top: 25px;
          left: 25px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: 
            linear-gradient(145deg, #A0522D 0%, #8B4513 30%, #654321 70%, #4A2511 100%);
          box-shadow: 
            0 15px 45px rgba(0, 0, 0, 0.3),
            0 5px 15px rgba(0, 0, 0, 0.2),
            inset 0 -8px 15px rgba(0, 0, 0, 0.4),
            inset 0 2px 5px rgba(255, 255, 255, 0.2),
            inset -5px -5px 20px rgba(0, 0, 0, 0.3);
          animation: cup-pulse 3s ease-in-out infinite;
          position: relative;
          overflow: visible;
        }

        .cup-rim::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(145deg, rgba(160, 82, 45, 0.4), transparent);
          filter: blur(8px);
          opacity: 0.6;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .cup-rim::after {
          content: '';
          position: absolute;
          top: 5%;
          left: 15%;
          width: 30%;
          height: 25%;
          background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3), transparent);
          border-radius: 50%;
          filter: blur(8px);
          animation: shine-move 4s ease-in-out infinite;
        }

        @keyframes cup-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes shine-move {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(10px, -5px);
            opacity: 0.5;
          }
        }

        /* Coffee Surface - Realistic Liquid */
        .coffee-surface {
          position: absolute;
          top: 38px;
          left: 38px;
          width: 124px;
          height: 124px;
          border-radius: 50%;
          background: 
            radial-gradient(circle at 35% 35%, #4A2511 0%, #3E2723 20%, #2C1810 50%, #1B0F0A 100%);
          overflow: hidden;
          box-shadow: 
            inset 0 5px 15px rgba(0, 0, 0, 0.6),
            inset 0 -3px 8px rgba(101, 67, 33, 0.3);
          animation: coffee-shimmer 5s ease-in-out infinite;
        }

        .coffee-surface::before {
          content: '';
          position: absolute;
          top: 10%;
          left: 20%;
          width: 40%;
          height: 40%;
          background: radial-gradient(ellipse at center, rgba(139, 69, 19, 0.2), transparent);
          border-radius: 50%;
          filter: blur(15px);
          animation: coffee-highlight 4s ease-in-out infinite;
        }

        @keyframes coffee-shimmer {
          0%, 100% {
            filter: brightness(1) contrast(1);
          }
          50% {
            filter: brightness(1.1) contrast(1.05);
          }
        }

        @keyframes coffee-highlight {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(5px, 5px) scale(1.1);
            opacity: 0.5;
          }
        }

        /* Enhanced Ripples - Multiple Layers */
        .ripple {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(139, 69, 19, 0.4);
          box-shadow: 
            0 0 10px rgba(139, 69, 19, 0.2),
            inset 0 0 10px rgba(255, 255, 255, 0.1);
          animation: ripple-animation 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .ripple-1 {
          top: 50%;
          left: 50%;
          width: 25px;
          height: 25px;
          margin: -12.5px 0 0 -12.5px;
          animation-delay: 0s;
        }

        .ripple-2 {
          top: 50%;
          left: 50%;
          width: 50px;
          height: 50px;
          margin: -25px 0 0 -25px;
          animation-delay: 1.3s;
          border-color: rgba(160, 82, 45, 0.3);
        }

        .ripple-3 {
          top: 50%;
          left: 50%;
          width: 75px;
          height: 75px;
          margin: -37.5px 0 0 -37.5px;
          animation-delay: 2.6s;
          border-color: rgba(101, 67, 33, 0.25);
        }

        @keyframes ripple-animation {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Professional Steam Effect */
        .steam {
          position: absolute;
          width: 4px;
          height: 50px;
          background: linear-gradient(
            to top, 
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.6) 30%,
            rgba(255, 255, 255, 0.3) 60%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(3px);
          animation: steam-rise 3s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .steam::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: inherit;
          filter: blur(5px);
          opacity: 0.5;
        }

        .steam-1 {
          left: 60px;
          top: 8px;
          animation-delay: 0s;
        }

        .steam-2 {
          left: 85px;
          top: 5px;
          animation-delay: 1s;
          height: 55px;
        }

        .steam-3 {
          left: 110px;
          top: 8px;
          animation-delay: 2s;
          height: 48px;
        }

        @keyframes steam-rise {
          0% {
            transform: translateY(0) translateX(0) scaleX(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.6;
            transform: translateY(-35px) translateX(8px) scaleX(1.5);
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-60px) translateX(15px) scaleX(2);
            opacity: 0;
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

        /* CTA Button - Glassmorphism Pill Design */
        .cta-button {
          padding: 22px 52px;
          background: rgba(139, 69, 19, 0.15);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          color: #2A2A2A;
          border: 2px solid rgba(139, 69, 19, 0.25);
          border-radius: 100px;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0.8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 
            0 8px 32px rgba(139, 69, 19, 0.2),
            0 4px 16px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.4),
            inset 0 -1px 0 rgba(139, 69, 19, 0.2);
          transition: all 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
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

        /* Hover state - Enhanced glass effect */
        .cta-button:hover {
          transform: translateY(-8px) scale(1.05);
          background: rgba(139, 69, 19, 0.25);
          border-color: rgba(139, 69, 19, 0.4);
          box-shadow: 
            0 16px 48px rgba(139, 69, 19, 0.3),
            0 8px 24px rgba(0, 0, 0, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 0.5),
            inset 0 -2px 0 rgba(139, 69, 19, 0.3),
            0 0 60px rgba(139, 69, 19, 0.15);
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
          background: rgba(139, 69, 19, 0.3);
          box-shadow: 
            0 4px 20px rgba(139, 69, 19, 0.25),
            inset 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* Focus state for accessibility */
        .cta-button:focus-visible {
          outline: 3px solid rgba(139, 69, 19, 0.5);
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
              0 8px 32px rgba(139, 69, 19, 0.2),
              0 4px 16px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
          50% {
            box-shadow: 
              0 12px 40px rgba(139, 69, 19, 0.3),
              0 6px 20px rgba(0, 0, 0, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.5),
              0 0 40px rgba(139, 69, 19, 0.1);
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
          color: #12B1C5;
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

          .coffee-cup-container {
            margin-bottom: 36px;
          }

          .coffee-cup {
            width: 140px;
            height: 140px;
          }

          .cup-rim {
            top: 17.5px;
            left: 17.5px;
            width: 105px;
            height: 105px;
          }

          .coffee-surface {
            top: 26.6px;
            left: 26.6px;
            width: 86.8px;
            height: 86.8px;
          }

          .steam {
            height: 35px;
          }

          .steam-1 {
            left: 42px;
            top: 6px;
          }

          .steam-2 {
            left: 59.5px;
            top: 3.5px;
            height: 38.5px;
          }

          .steam-3 {
            left: 77px;
            top: 6px;
            height: 33.6px;
          }

          .ripple-1 {
            width: 17.5px;
            height: 17.5px;
            margin: -8.75px 0 0 -8.75px;
          }

          .ripple-2 {
            width: 35px;
            height: 35px;
            margin: -17.5px 0 0 -17.5px;
          }

          .ripple-3 {
            width: 52.5px;
            height: 52.5px;
            margin: -26.25px 0 0 -26.25px;
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

          .coffee-cup-container {
            margin-bottom: 28px;
          }

          .coffee-cup {
            width: 120px;
            height: 120px;
          }

          .cup-rim {
            top: 15px;
            left: 15px;
            width: 90px;
            height: 90px;
          }

          .coffee-surface {
            top: 22.8px;
            left: 22.8px;
            width: 74.4px;
            height: 74.4px;
          }

          .steam {
            height: 30px;
            width: 3px;
          }

          .steam-1 {
            left: 36px;
            top: 5px;
          }

          .steam-2 {
            left: 51px;
            top: 3px;
            height: 33px;
          }

          .steam-3 {
            left: 66px;
            top: 5px;
            height: 28.8px;
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
