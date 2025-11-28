'use client';

import { useState, useEffect } from 'react';
import { RoomAudioRenderer, StartAudio, useVoiceAssistant, BarVisualizer, useRoomContext } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionProvider, useSession } from '@/components/app/session-provider';
import { Toaster } from '@/components/livekit/toaster';
import { GroceryStore } from '@/components/grocery-store';
import { Microphone, PaperPlaneRight } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useChatMessages } from '@/hooks/useChatMessages';

interface GroceryVoiceAppProps {
  appConfig: AppConfig;
}

function VoiceModalContent({ onClose }: { onClose: () => void }) {
  const { startSession, isSessionActive, appConfig } = useSession();
  const { state, audioTrack } = useVoiceAssistant();
  const messages = useChatMessages();
  const room = useRoomContext();
  const [chatInput, setChatInput] = useState('');
  const [localMessages, setLocalMessages] = useState<Array<{ role: 'user' | 'agent'; text: string }>>([]);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Request microphone permission explicitly
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately, we just needed to get permission
        stream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
      } catch (error) {
        console.error('Microphone permission denied:', error);
        setMicPermission('denied');
      }
    };
    
    requestMicPermission();
  }, []);

  useEffect(() => {
    // Start session regardless of mic permission (chat will still work)
    if (!isSessionActive) {
      startSession();
    }
  }, [isSessionActive, startSession]);

  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';

  // Combine LiveKit messages with local messages
  const livekitTranscript = messages.map((msg) => ({
    role: msg.from?.isLocal ? ('user' as const) : ('agent' as const),
    text: msg.message || '',
    timestamp: msg.timestamp,
  }));

  const transcript = [...localMessages, ...livekitTranscript].sort((a, b) => {
    const aTime = 'timestamp' in a ? a.timestamp : Date.now();
    const bTime = 'timestamp' in b ? b.timestamp : Date.now();
    return aTime - bTime;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() && room) {
      const messageText = chatInput.trim();
      
      try {
        // Send as proper chat message using LiveKit's chat format
        const chatMessage = {
          message: messageText,
          timestamp: Date.now(),
        };
        
        await room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(chatMessage)),
          { reliable: true, topic: 'lk-chat-topic' }
        );
        
        setChatInput('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              <Microphone size={28} weight="fill" className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Voice Shopping Assistant</h2>
              <p className="text-sm text-white/90">Powered by Murf Falcon TTS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isSessionActive ? (
            <div className="space-y-6">
              {/* Microphone Warning */}
              {micPermission === 'denied' && (
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 mb-1">Voice Input Disabled</h4>
                      <p className="text-sm text-yellow-800 mb-2">
                        Microphone access was denied. You can still use chat to interact with the assistant.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                      >
                        Enable Microphone
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Voice Status */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 shadow-inner">
                  {isSpeaking ? (
                    <div className="flex items-center justify-center">
                      <BarVisualizer
                        state={state}
                        barCount={7}
                        trackRef={audioTrack}
                        className="h-16 w-24"
                        options={{ minHeight: 8, maxHeight: 60 }}
                      />
                    </div>
                  ) : (
                    <Microphone 
                      size={64} 
                      weight="fill" 
                      className={isListening ? 'text-green-600 animate-pulse' : 'text-green-400'} 
                    />
                  )}
                  {isListening && (
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-600 shadow-lg">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  {isListening && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-600"></div>
                      <span className="text-sm font-semibold">Listening to you...</span>
                    </div>
                  )}
                  {isSpeaking && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
                      <span className="text-sm font-semibold">Assistant speaking...</span>
                    </div>
                  )}
                  {!isListening && !isSpeaking && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-gray-600">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <span className="text-sm font-medium">Ready to help you shop</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat/Transcript Section */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="text-lg">💬</span>
                  <h3 className="font-semibold text-gray-800">Conversation</h3>
                </div>
                <div className="max-h-48 space-y-2 overflow-y-auto p-4">
                  {transcript.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-8">
                      Your conversation will appear here...
                    </p>
                  ) : (
                    transcript.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'rounded-lg p-3 text-sm',
                          msg.role === 'user'
                            ? 'bg-green-50 text-green-900 ml-4'
                            : 'bg-blue-50 text-blue-900 mr-4'
                        )}
                      >
                        <div className="font-semibold text-xs mb-1">
                          {msg.role === 'user' ? 'You' : 'Assistant'}
                        </div>
                        <div>{msg.text}</div>
                      </div>
                    ))
                  )}
                </div>
                {/* Chat Input */}
                <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 caret-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-white transition hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <PaperPlaneRight size={20} weight="fill" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Help Text */}
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <p className="text-sm font-bold text-blue-900">Try saying:</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/60 p-2 backdrop-blur">
                    <p className="text-xs font-medium text-blue-800">"Add milk to cart"</p>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2 backdrop-blur">
                    <p className="text-xs font-medium text-blue-800">"Ingredients for pasta"</p>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2 backdrop-blur">
                    <p className="text-xs font-medium text-blue-800">"What's in my cart?"</p>
                  </div>
                  <div className="rounded-lg bg-white/60 p-2 backdrop-blur">
                    <p className="text-xs font-medium text-blue-800">"Place my order"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mb-6 inline-block h-16 w-16 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
                <p className="text-lg font-medium text-gray-700">Connecting to voice assistant...</p>
                <p className="mt-2 text-sm text-gray-500">This will only take a moment</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Back Button */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            <span>←</span>
            <span>Back to Shopping</span>
          </button>
        </div>
      </div>
      <RoomAudioRenderer />
      <StartAudio label="Click to enable audio" />
    </div>
  );
}

export function GroceryVoiceApp({ appConfig }: GroceryVoiceAppProps) {
  const [showVoice, setShowVoice] = useState(false);

  return (
    <div className="relative">
      <GroceryStore />
      
      {/* Floating Voice Button */}
      <button
        onClick={() => setShowVoice(!showVoice)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
      >
        <Microphone size={32} weight="fill" />
      </button>

      {/* Voice Agent Modal */}
      {showVoice && (
        <SessionProvider appConfig={appConfig}>
          <VoiceModalContent onClose={() => setShowVoice(false)} />
          <Toaster />
        </SessionProvider>
      )}
    </div>
  );
}
