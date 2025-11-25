'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Track } from 'livekit-client';
import { RoomAudioRenderer, useVoiceAssistant, useRoomContext, LiveKitRoom } from '@livekit/components-react';
import { ChatBubble } from '@/components/tutor/chat-bubble';
import { ListeningIndicator } from '@/components/tutor/listening-indicator';
import { TutorBottomNav } from '@/components/tutor/tutor-bottom-nav';
import { ChatInput } from '@/components/tutor/chat-input';
import { NeonLoader } from '@/components/tutor/neon-loader';

type Mode = 'learn' | 'quiz' | 'teach_back' | null;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

function SessionContent() {
  const router = useRouter();
  const room = useRoomContext();
  const { state, audioTrack } = useVoiceAssistant();
  
  const [mode, setMode] = useState<Mode>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChatInput, setShowChatInput] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false); // Start with mic OFF
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize mic when room connects
  useEffect(() => {
    if (room && room.state === 'connected' && !hasInitialized.current) {
      hasInitialized.current = true;
      console.log('✅ Room connected');
      
      // Enable mic after a short delay
      setTimeout(async () => {
        try {
          await room.localParticipant.setMicrophoneEnabled(true);
          setIsMicEnabled(true);
          console.log('🎤 Microphone enabled');
        } catch (error) {
          console.error('❌ Failed to enable microphone:', error);
        }
      }, 500);
    }
  }, [room]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Listen for agent messages and transcripts
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant: any) => {
      const decoder = new TextDecoder();
      const text = decoder.decode(payload);
      
      console.log('📨 Data received:', text);
      
      if (text.trim()) {
        const newMessage: Message = {
          id: `agent-${Date.now()}`,
          role: 'assistant',
          content: text,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleTranscriptionReceived = (segments: any[], participant: any) => {
      console.log('📝 Transcription:', segments);
      
      segments.forEach((segment) => {
        if (segment.final && segment.text.trim()) {
          const isAgent = participant?.identity?.includes('agent');
          const newMessage: Message = {
            id: `${isAgent ? 'agent' : 'user'}-${Date.now()}-${Math.random()}`,
            role: isAgent ? 'assistant' : 'user',
            content: segment.text,
            timestamp: new Date(),
          };
          setMessages((prev) => {
            // Avoid duplicates
            const exists = prev.some(m => m.content === segment.text && Math.abs(m.timestamp.getTime() - newMessage.timestamp.getTime()) < 1000);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      });
    };

    room.on('dataReceived', handleDataReceived);
    room.on('transcriptionReceived', handleTranscriptionReceived);
    
    return () => {
      room.off('dataReceived', handleDataReceived);
      room.off('transcriptionReceived', handleTranscriptionReceived);
    };
  }, [room]);

  // Detect mode
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      const content = lastMessage.content.toLowerCase();
      if (content.includes('learn mode') || content.includes('matthew')) {
        setMode('learn');
      } else if (content.includes('quiz mode') || content.includes('alicia')) {
        setMode('quiz');
      } else if (content.includes('teach-back') || content.includes('teach back') || content.includes('ken')) {
        setMode('teach_back');
      }
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    console.log('💬 Sending message:', content);
    
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    if (room) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        await room.localParticipant.publishData(data, { reliable: true });
        console.log('✅ Message sent');
      } catch (error) {
        console.error('❌ Failed to send message:', error);
      }
    }
  };

  const handleMicToggle = async () => {
    if (room) {
      const newState = !isMicEnabled;
      console.log('🎤 Toggling mic:', newState);
      await room.localParticipant.setMicrophoneEnabled(newState);
      setIsMicEnabled(newState);
    }
  };

  const handleBack = () => {
    console.log('⬅️ Going back to welcome');
    router.push('/welcome');
  };

  const getModeColor = () => {
    switch (mode) {
      case 'learn': return 'from-blue-500/20 to-blue-600/10';
      case 'quiz': return 'from-green-500/20 to-green-600/10';
      case 'teach_back': return 'from-purple-500/20 to-purple-600/10';
      default: return 'from-cyan-500/20 to-purple-500/10';
    }
  };

  const isAgentSpeaking = state === 'speaking';
  const isListening = isMicEnabled && (state === 'listening' || state === 'thinking');

  return (
    <main className="session-container">
      {/* Background layers */}
      <div className="absolute inset-0 opacity-10 pixel-bg" />
      <div className={`absolute inset-0 bg-gradient-to-br ${getModeColor()} transition-all duration-500`} />

      {/* Header: Listening Indicator */}
      <header className="session-header">
        <ListeningIndicator 
          mode={mode} 
          isListening={isListening}
          isAISpeaking={isAgentSpeaking}
        />
      </header>

      {/* Main: Chat Feed */}
      <section 
        ref={chatContainerRef}
        className="session-chat"
      >
        <div className="chat-inner">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p className="text-sm text-gray-500">
                {isAgentSpeaking ? 'Agent is speaking...' : 'Start a conversation...'}
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}
              {isAgentSpeaking && (
                <div className="flex justify-start">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer: Navigation */}
      <footer className="session-footer">
        {showChatInput ? (
          <ChatInput
            onSend={handleSendMessage}
            onClose={() => setShowChatInput(false)}
          />
        ) : (
          <TutorBottomNav
            isListening={isListening}
            onMicToggle={handleMicToggle}
            onChatToggle={() => setShowChatInput(true)}
            onBack={handleBack}
            onProgress={() => router.push('/progress')}
          />
        )}
      </footer>

      <RoomAudioRenderer />

      <style jsx>{`
        .session-container {
          position: relative;
          height: 100svh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #0C0C0E;
        }

        .pixel-bg {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 16px 16px;
          animation: pixelFloat 30s linear infinite;
        }

        @keyframes pixelFloat {
          0% { transform: translate(0, 0); }
          100% { transform: translate(16px, 16px); }
        }

        .session-header {
          position: relative;
          z-index: 10;
          flex-shrink: 0;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
        }

        .session-chat {
          position: relative;
          z-index: 10;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }

        .session-chat::-webkit-scrollbar {
          width: 4px;
        }

        .session-chat::-webkit-scrollbar-track {
          background: transparent;
        }

        .session-chat::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .chat-inner {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .session-footer {
          position: relative;
          z-index: 50;
          flex-shrink: 0;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 10px 14px;
          background: rgba(0, 255, 255, 0.08);
          border: 1px solid rgba(0, 255, 255, 0.15);
          border-radius: 14px;
          backdrop-filter: blur(20px);
        }

        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00ffff;
          animation: typing 1.4s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}

export default function SessionPage() {
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/connection-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Connected to LiveKit');
        setConnectionDetails(data);
      })
      .catch((err) => {
        console.error('❌ Connection failed:', err);
        setError('Failed to connect');
      });
  }, []);

  if (error) {
    return (
      <div className="flex h-[100svh] items-center justify-center bg-[#0C0C0E]">
        <div className="glass-error-card">
          <div className="mb-4 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-lg bg-red-500/10 p-3">
              <svg className="h-full w-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="mb-4 text-sm text-red-400">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-full bg-cyan-500 px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Retry Connection
          </button>
        </div>
        <style jsx>{`
          .glass-error-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 32px;
            max-width: 320px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          }
        `}</style>
      </div>
    );
  }

  if (!connectionDetails) {
    return <NeonLoader message="Connecting to voice agent..." />;
  }

  return (
    <LiveKitRoom
      serverUrl={connectionDetails.serverUrl}
      token={connectionDetails.participantToken}
      connect={true}
      audio={true}
      video={false}
      onError={(error) => setError(error.message)}
    >
      <SessionContent />
    </LiveKitRoom>
  );
}
