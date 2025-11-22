import { Button } from '@/components/livekit/button';

function WelcomeImage() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-fg0 mb-4 size-16"
    >
      <path
        d="M15 24V40C15 40.7957 14.6839 41.5587 14.1213 42.1213C13.5587 42.6839 12.7956 43 12 43C11.2044 43 10.4413 42.6839 9.87868 42.1213C9.31607 41.5587 9 40.7957 9 40V24C9 23.2044 9.31607 22.4413 9.87868 21.8787C10.4413 21.3161 11.2044 21 12 21C12.7956 21 13.5587 21.3161 14.1213 21.8787C14.6839 22.4413 15 23.2044 15 24ZM22 5C21.2044 5 20.4413 5.31607 19.8787 5.87868C19.3161 6.44129 19 7.20435 19 8V56C19 56.7957 19.3161 57.5587 19.8787 58.1213C20.4413 58.6839 21.2044 59 22 59C22.7956 59 23.5587 58.6839 24.1213 58.1213C24.6839 57.5587 25 56.7957 25 56V8C25 7.20435 24.6839 6.44129 24.1213 5.87868C23.5587 5.31607 22.7956 5 22 5ZM32 13C31.2044 13 30.4413 13.3161 29.8787 13.8787C29.3161 14.4413 29 15.2044 29 16V48C29 48.7957 29.3161 49.5587 29.8787 50.1213C30.4413 50.6839 31.2044 51 32 51C32.7956 51 33.5587 50.6839 34.1213 50.1213C34.6839 49.5587 35 48.7957 35 48V16C35 15.2044 34.6839 14.4413 34.1213 13.8787C33.5587 13.3161 32.7956 13 32 13ZM42 21C41.2043 21 40.4413 21.3161 39.8787 21.8787C39.3161 22.4413 39 23.2044 39 24V40C39 40.7957 39.3161 41.5587 39.8787 42.1213C40.4413 42.6839 41.2043 43 42 43C42.7957 43 43.5587 42.6839 44.1213 42.1213C44.6839 41.5587 45 40.7957 45 40V24C45 23.2044 44.6839 22.4413 44.1213 21.8787C43.5587 21.3161 42.7957 21 42 21ZM52 17C51.2043 17 50.4413 17.3161 49.8787 17.8787C49.3161 18.4413 49 19.2044 49 20V44C49 44.7957 49.3161 45.5587 49.8787 46.1213C50.4413 46.6839 51.2043 47 52 47C52.7957 47 53.5587 46.6839 54.1213 46.1213C54.6839 45.5587 55 44.7957 55 44V20C55 19.2044 54.6839 18.4413 54.1213 17.8787C53.5587 17.3161 52.7957 17 52 17Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
    <div ref={ref} className="relative h-screen w-screen overflow-hidden bg-[#0C0C0E]">
      {/* Abstract gradient shapes at borders */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top-left abstract blob */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 rounded-[40%_60%_70%_30%/60%_30%_70%_40%] blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        
        {/* Top-right flowing shape */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-purple-500/25 to-pink-500/15 rounded-[60%_40%_30%_70%/40%_60%_70%_30%] blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        {/* Bottom-left organic shape */}
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-cyan-500/25 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        
        {/* Bottom-right abstract form */}
        <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] bg-gradient-to-tl from-purple-600/30 to-indigo-500/20 rounded-[70%_30%_50%_50%/60%_40%_60%_40%] blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
        
        {/* Middle-right accent */}
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-[50%_50%_30%_70%/60%_40%_60%_40%] blur-2xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }} />
        
        {/* Middle-left accent */}
        <div className="absolute bottom-1/3 -left-20 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-transparent rounded-[70%_30%_50%_50%/40%_60%_40%_60%] blur-2xl animate-pulse" style={{ animationDuration: '11s', animationDelay: '5s' }} />
      </div>

      {/* Animated grid overlay for depth */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
      </div>

      {/* Grid animation keyframes */}
      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(80px, 80px);
          }
        }
      `}</style>

      <section className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* Elegant pulsing orb with chat icon */}
        <div className="relative mb-16">
          {/* Outer pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute h-32 w-32 md:h-40 md:w-40 rounded-full border-2 border-cyan-400/20 animate-pulse" style={{ animationDuration: '2s' }} />
            <div className="absolute h-40 w-40 md:h-48 md:w-48 rounded-full border border-cyan-400/10 animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            <div className="absolute h-48 w-48 md:h-56 md:w-56 rounded-full border border-purple-400/10 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>
          
          {/* Center orb */}
          <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-cyan-400/90 to-purple-500/90 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
            {/* Inner glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
            
            {/* Sound wave bars */}
            <svg className="relative z-10 w-12 h-12 md:w-14 md:h-14 text-white" viewBox="0 0 48 48" fill="currentColor">
              <rect x="4" y="18" width="4" height="12" rx="2" className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '0s' }}/>
              <rect x="12" y="12" width="4" height="24" rx="2" className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.1s' }}/>
              <rect x="20" y="8" width="4" height="32" rx="2" className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.2s' }}/>
              <rect x="28" y="14" width="4" height="20" rx="2" className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.3s' }}/>
              <rect x="36" y="10" width="4" height="28" rx="2" className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '0.4s' }}/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Start a conversation
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-md mx-auto">
            Speak naturally with AI that understands and responds in real-time
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={onStartCall}
          className="mt-12 group relative px-8 py-4 bg-white rounded-full flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {/* Glow effect on hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-300" />
          
          <span className="relative z-10 text-gray-900 font-semibold text-base">
            {startButtonText}
          </span>
          <svg className="relative z-10 w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Features */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Real-time responses</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Natural voice</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Powered by Murf Falcon</span>
          </div>
        </div>
      </section>
    </div>
  );
};
