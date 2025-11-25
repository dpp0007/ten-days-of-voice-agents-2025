'use client';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatBubble({ role, content, timestamp }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-float-up`}>
      <div className={`max-w-[80%] sm:max-w-[75%] md:max-w-[60%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* Label */}
        <span className="px-2 text-xs font-medium text-gray-500">
          {isUser ? 'You' : 'Tutor'}
        </span>

        {/* Bubble */}
        <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-ai'} group relative`}>
          {/* Pixel corner accent */}
          {!isUser && (
            <div className="absolute -left-1 -top-1 h-2 w-2 border-l-2 border-t-2 border-cyan-500/50" />
          )}
          {isUser && (
            <div className="absolute -right-1 -top-1 h-2 w-2 border-r-2 border-t-2 border-purple-500/50" />
          )}

          <p className="break-words text-sm leading-relaxed text-gray-100 sm:text-base">
            {content}
          </p>

          {/* Timestamp on hover */}
          <div className="absolute -bottom-5 left-0 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-xs text-gray-600">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bubble {
          padding: 10px 14px;
          border-radius: 14px;
          position: relative;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        @media (min-width: 640px) {
          .bubble {
            padding: 12px 16px;
            border-radius: 16px;
          }
        }

        .bubble-ai {
          background: rgba(0, 255, 255, 0.08);
          border: 1px solid rgba(0, 255, 255, 0.15);
          box-shadow: 
            0 4px 16px rgba(0, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .bubble-user {
          background: rgba(138, 43, 226, 0.08);
          border: 1px solid rgba(138, 43, 226, 0.15);
          box-shadow: 
            0 4px 16px rgba(138, 43, 226, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .bubble:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 24px rgba(0, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        @keyframes float-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-up {
          animation: float-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
