import { useState } from 'react';
import { Button } from '@/components/livekit/button';

function WelcomeImage() {
  return (
    <div className="mb-6 flex items-center justify-center">
      <div className="bg-[#111A3D] p-4" style={{ borderRadius: '4px' }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#F9D66B]"
        >
          <path
            d="M15 24V40C15 40.7957 14.6839 41.5587 14.1213 42.1213C13.5587 42.6839 12.7956 43 12 43C11.2044 43 10.4413 42.6839 9.87868 42.1213C9.31607 41.5587 9 40.7957 9 40V24C9 23.2044 9.31607 22.4413 9.87868 21.8787C10.4413 21.3161 11.2044 21 12 21C12.7956 21 13.5587 21.3161 14.1213 21.8787C14.6839 22.4413 15 23.2044 15 24ZM22 5C21.2044 5 20.4413 5.31607 19.8787 5.87868C19.3161 6.44129 19 7.20435 19 8V56C19 56.7957 19.3161 57.5587 19.8787 58.1213C20.4413 58.6839 21.2044 59 22 59C22.7956 59 23.5587 58.6839 24.1213 58.1213C24.6839 57.5587 25 56.7957 25 56V8C25 7.20435 24.6839 6.44129 24.1213 5.87868C23.5587 5.31607 22.7956 5 22 5ZM32 13C31.2044 13 30.4413 13.3161 29.8787 13.8787C29.3161 14.4413 29 15.2044 29 16V48C29 48.7957 29.3161 49.5587 29.8787 50.1213C30.4413 50.6839 31.2044 51 32 51C32.7956 51 33.5587 50.6839 34.1213 50.1213C34.6839 49.5587 35 48.7957 35 48V16C35 15.2044 34.6839 14.4413 34.1213 13.8787C33.5587 13.3161 32.7956 13 32 13ZM42 21C41.2043 21 40.4413 21.3161 39.8787 21.8787C39.3161 22.4413 39 23.2044 39 24V40C39 40.7957 39.3161 41.5587 39.8787 42.1213C40.4413 42.6839 41.2043 43 42 43C42.7957 43 43.5587 42.6839 44.1213 42.1213C44.6839 41.5587 45 40.7957 45 40V24C45 23.2044 44.6839 22.4413 44.1213 21.8787C43.5587 21.3161 42.7957 21 42 21ZM52 17C51.2043 17 50.4413 17.3161 49.8787 17.8787C49.3161 18.4413 49 19.2044 49 20V44C49 44.7957 49.3161 45.5587 49.8787 46.1213C50.4413 46.6839 51.2043 47 52 47C52.7957 47 53.5587 46.6839 54.1213 46.1213C54.6839 45.5587 55 44.7957 55 44V20C55 19.2044 54.6839 18.4413 54.1213 17.8787C53.5587 17.3161 52.7957 17 52 17Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: (playerName: string) => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleStartCall = () => {
    const trimmedName = playerName.trim();
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    setError('');
    onStartCall(trimmedName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartCall();
    }
  };

  return (
    <div ref={ref} className="pixel-sky-bg flex min-h-screen items-center justify-center p-4">
      {/* Pixel Stars */}
      <div
        className="pixel-star"
        style={{ width: '3px', height: '3px', top: '10%', left: '15%', animationDelay: '0s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '2px',
          height: '2px',
          top: '20%',
          left: '80%',
          animationDelay: '1s',
          background: '#FFD166',
        }}
      />
      <div
        className="pixel-star"
        style={{ width: '4px', height: '4px', top: '30%', left: '25%', animationDelay: '2s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '3px',
          height: '3px',
          top: '15%',
          left: '60%',
          animationDelay: '1.5s',
          background: '#9D7CFF',
        }}
      />
      <div
        className="pixel-star"
        style={{ width: '2px', height: '2px', top: '40%', left: '90%', animationDelay: '0.5s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '3px',
          height: '3px',
          top: '60%',
          left: '10%',
          animationDelay: '2.5s',
          background: '#FFD166',
        }}
      />
      <div
        className="pixel-star"
        style={{ width: '4px', height: '4px', top: '70%', left: '70%', animationDelay: '1.2s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '2px',
          height: '2px',
          top: '80%',
          left: '40%',
          animationDelay: '3s',
          background: '#9D7CFF',
        }}
      />

      {/* Floating Blocks */}
      <div
        className="pixel-block"
        style={{
          width: '8px',
          height: '8px',
          bottom: '-50px',
          left: '20%',
          animationDelay: '0s',
          animationDuration: '30s',
        }}
      />
      <div
        className="pixel-block"
        style={{
          width: '12px',
          height: '12px',
          bottom: '-80px',
          left: '60%',
          animationDelay: '5s',
          animationDuration: '35s',
        }}
      />
      <div
        className="pixel-block"
        style={{
          width: '6px',
          height: '6px',
          bottom: '-30px',
          left: '85%',
          animationDelay: '10s',
          animationDuration: '28s',
        }}
      />
      <div
        className="pixel-block"
        style={{
          width: '10px',
          height: '10px',
          bottom: '-60px',
          left: '40%',
          animationDelay: '15s',
          animationDuration: '32s',
        }}
      />

      {/* Dark overlay for contrast */}
      <div className="pixel-sky-overlay" />

      <div className="relative z-10 w-full max-w-[520px]">
        {/* ON AIR Badge */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2"
            style={{
              backgroundColor: '#E95353',
              borderRadius: '2px',
              border: '3px solid #000',
            }}
          >
            <div
              className="blink h-2 w-2"
              style={{
                backgroundColor: '#FFF',
                borderRadius: '1px',
              }}
            />
            <span
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '10px', color: '#FFF' }}
            >
              ON AIR
            </span>
          </div>

          {/* Pixel Hearts */}
          <div className="flex items-center gap-1">
            <span style={{ color: '#E95353', fontSize: '16px', lineHeight: '1' }}>♥</span>
            <span style={{ color: '#E95353', fontSize: '16px', lineHeight: '1' }}>♥</span>
            <span style={{ color: '#E95353', fontSize: '16px', lineHeight: '1' }}>♥</span>
          </div>
        </div>

        {/* Main Card */}
        <div
          className="p-8"
          style={{
            backgroundColor: '#111A3D',
            border: '4px solid #F9D66B',
            borderRadius: '4px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 8px 8px 0px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="flex flex-col items-center text-center">
            <WelcomeImage />

            <h1
              className="mb-3 text-2xl"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: '#F7F5EF',
                letterSpacing: '2px',
                lineHeight: '1.6',
              }}
            >
              IMPROV BATTLE
            </h1>

            <p className="mb-2 text-sm" style={{ color: '#9BA4CF' }}>
              Voice-First Improv Game Show
            </p>

            <p className="mb-8 max-w-md text-sm" style={{ color: '#9BA4CF' }}>
              Enter your stage name and get ready to perform live improv scenarios
            </p>

            <div className="w-full space-y-4">
              <input
                type="text"
                placeholder="ENTER STAGE NAME..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 text-base uppercase transition-all duration-200 placeholder:normal-case"
                style={{
                  backgroundColor: '#0C1635',
                  border: '3px solid #252D55',
                  borderRadius: '2px',
                  color: '#F7F5EF',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4AD4C6')}
                onBlur={(e) => (e.target.style.borderColor = '#252D55')}
                autoFocus
              />

              {error && (
                <p className="text-sm" style={{ color: '#E95353' }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleStartCall}
                disabled={!playerName.trim()}
                className="w-full px-6 py-4 text-base font-bold tracking-wide uppercase transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: playerName.trim() ? '#F9D66B' : '#4a4a4a',
                  color: '#000000',
                  border: '4px solid #000',
                  borderRadius: '2px',
                  boxShadow: playerName.trim() ? '4px 4px 0px #000' : '2px 2px 0px #000',
                }}
                onMouseEnter={(e) => {
                  if (playerName.trim()) {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px #000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (playerName.trim()) {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px #000';
                  }
                }}
                onMouseDown={(e) => {
                  if (playerName.trim()) {
                    e.currentTarget.style.transform = 'translate(2px, 2px)';
                    e.currentTarget.style.boxShadow = '2px 2px 0px #000';
                  }
                }}
                onMouseUp={(e) => {
                  if (playerName.trim()) {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px #000';
                  }
                }}
              >
                ▶ START IMPROV BATTLE
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: '#9BA4CF' }}>
            Powered by Murf Falcon · LiveKit · Gemini
          </p>
        </div>
      </div>
    </div>
  );
};
