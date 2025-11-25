'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onClose: () => void;
}

export function ChatInput({ onSend, onClose }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="animate-slide-up px-4 pb-6">
      <form onSubmit={handleSubmit} className="glass-input-bar mx-auto flex max-w-2xl items-center gap-3 rounded-full px-4 py-3">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim()}
          className="send-button flex-shrink-0 rounded-full p-2 transition-all disabled:opacity-30"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>

      <style jsx>{`
        .glass-input-bar {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1.5px solid rgba(0, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .send-button {
          background: linear-gradient(135deg, #00ffff 0%, #8a2be2 100%);
          color: white;
        }

        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .send-button:active:not(:disabled) {
          transform: scale(0.98);
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
