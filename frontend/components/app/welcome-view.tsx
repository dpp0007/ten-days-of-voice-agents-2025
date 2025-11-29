import { Button } from '@/components/livekit/button';

function WelcomeImage() {
  return (
    <div className="relative w-64 h-64 mb-8">
      {/* Animated Storm Background */}
      <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-violet-800 to-indigo-900 animate-pulse"></div>
        {/* Storm clouds */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-20 h-8 bg-gray-800/50 rounded-full blur-xl animate-[float_4s_ease-in-out_infinite]"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-10 bg-gray-700/40 rounded-full blur-xl animate-[float_5s_ease-in-out_infinite_0.5s]"></div>
        </div>
      </div>

      <svg
        width="256"
        height="256"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Lightning bolts - animated */}
        <g className="animate-[flash_3s_ease-in-out_infinite]">
          <path d="M70 40 L65 60 L72 60 L60 85" stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.8">
            <animate attributeName="opacity" values="0;1;0;0;0" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M130 35 L125 55 L132 55 L120 80" stroke="#fbbf24" strokeWidth="2.5" fill="none" opacity="0.6">
            <animate attributeName="opacity" values="0;0;1;0;0" dur="3s" repeatCount="indefinite" begin="0.5s" />
          </path>
        </g>

        {/* Floating Island Base - with float animation */}
        <g className="animate-[float_6s_ease-in-out_infinite]">
          <ellipse cx="100" cy="140" rx="55" ry="20" fill="url(#islandGrad)" opacity="0.9" />
          <ellipse cx="100" cy="138" rx="50" ry="18" fill="url(#islandTop)" />
          
          {/* Temple Structure */}
          {/* Base platform */}
          <rect x="75" y="115" width="50" height="8" fill="url(#stoneGrad)" rx="1" />
          
          {/* Pillars */}
          <rect x="78" y="95" width="6" height="20" fill="url(#pillarGrad)" />
          <rect x="95" y="95" width="6" height="20" fill="url(#pillarGrad)" />
          <rect x="112" y="95" width="6" height="20" fill="url(#pillarGrad)" />
          
          {/* Broken pillar effect */}
          <rect x="95" y="85" width="6" height="8" fill="url(#pillarGrad)" opacity="0.6" />
          
          {/* Temple roof */}
          <polygon points="100,75 70,95 130,95" fill="url(#roofGrad)" />
          <polygon points="100,78 73,95 127,95" fill="url(#roofHighlight)" opacity="0.3" />
          
          {/* Glowing Mark/Rune on temple */}
          <circle cx="100" cy="105" r="5" fill="#fbbf24" opacity="0.9">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="5;6;5" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Mystical glow around mark */}
          <circle cx="100" cy="105" r="8" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5">
            <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Storm swirls below */}
        <g opacity="0.4">
          <ellipse cx="100" cy="165" rx="40" ry="8" fill="#6366f1">
            <animate attributeName="rx" values="40;45;40" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="100" cy="170" rx="35" ry="6" fill="#8b5cf6">
            <animate attributeName="rx" values="35;40;35" dur="3s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Floating debris/rocks */}
        <circle cx="60" cy="120" r="3" fill="#78350f" opacity="0.6">
          <animateTransform attributeName="transform" type="translate" values="0,0; -5,10; 0,0" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="125" r="2.5" fill="#92400e" opacity="0.5">
          <animateTransform attributeName="transform" type="translate" values="0,0; 5,-8; 0,0" dur="6s" repeatCount="indefinite" />
        </circle>

        <defs>
          <linearGradient id="islandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="islandTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a8a29e" />
            <stop offset="100%" stopColor="#78716c" />
          </linearGradient>
          <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d6d3d1" />
            <stop offset="50%" stopColor="#a8a29e" />
            <stop offset="100%" stopColor="#78716c" />
          </linearGradient>
          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="roofHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* Outer glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-transparent to-transparent rounded-full animate-pulse"></div>
    </div>
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
    <div ref={ref} className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(251, 191, 36, 0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(251, 191, 36, 0.3) 2%, transparent 0%)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <WelcomeImage />

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
          Welcome to Aetherfall
        </h1>

        <p className="text-gray-200 max-w-prose text-xl font-medium mb-3">
          A Voice-Powered Sky Adventure
        </p>

        <p className="text-gray-400 max-w-lg text-base leading-7 mb-8">
          Awaken in a broken sky-temple above an endless storm. Discover the meaning of your glowing mark. Your Game Master awaits.
        </p>

        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-amber-900/50 rounded-xl p-6 max-w-md mb-8 text-left shadow-2xl">
          <p className="text-sm text-amber-500 mb-3 font-bold flex items-center gap-2">
            <span>📜</span> Your Character
          </p>
          <div className="text-sm space-y-2 text-gray-300">
            <p>⚔️ <span className="font-semibold text-gray-200">Class:</span> Marked One</p>
            <p>❤️ <span className="font-semibold text-gray-200">HP:</span> 20/20 (Stable)</p>
            <p>💪 <span className="font-semibold text-gray-200">Strength:</span> 12 | 🧠 <span className="font-semibold text-gray-200">Intelligence:</span> 12 | 🍀 <span className="font-semibold text-gray-200">Luck:</span> 12</p>
            <p>🎒 <span className="font-semibold text-gray-200">Inventory:</span> Empty</p>
            <p>✨ <span className="font-semibold text-gray-200">Quest:</span> Discover the glowing mark</p>
          </div>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="w-80 font-bold text-xl py-7 bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 hover:from-amber-600 hover:via-orange-500 hover:to-amber-600 shadow-2xl shadow-amber-900/50 border-2 border-amber-500/50"
        >
          ⚡ {startButtonText} ⚡
        </Button>

        <p className="text-gray-500 text-sm mt-6 italic max-w-md">
          🎤 Speak your actions. The Game Master will guide your journey through Aetherfall.
        </p>
      </section>

      <div className="relative pb-6 flex items-center justify-center px-4">
        <p className="text-gray-600 text-xs md:text-sm">
          🎲 Voice Game Master | Built with{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents/"
            className="text-amber-600 hover:text-amber-500 underline"
          >
            LiveKit Agents
          </a>
          {' '}& Murf Falcon TTS
        </p>
      </div>
    </div>
  );
};
