'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useVoiceAssistant } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { ChatTranscript } from '@/components/app/chat-transcript';
import { PreConnectMessage } from '@/components/app/preconnect-message';
import { TileLayout } from '@/components/app/tile-layout';
import { CharacterSheet } from '@/components/app/character-sheet';
import {
  AgentControlBar,
  type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../livekit/scroll-area/scroll-area';

const MotionBottom = motion.create('div');

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const BOTTOM_VIEW_MOTION_PROPS = {
  variants: {
    visible: {
      opacity: 1,
      translateY: '0%',
    },
    hidden: {
      opacity: 0,
      translateY: '100%',
    },
  },
  initial: 'hidden',
  animate: 'visible',
  exit: 'hidden',
  transition: {
    duration: 0.3,
    delay: 0.5,
    ease: 'easeOut',
  },
};

interface SessionViewProps {
  appConfig: AppConfig;
}

export const SessionView = ({
  appConfig,
  ...props
}: React.ComponentProps<'section'> & SessionViewProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const storyScrollRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { state } = useVoiceAssistant();

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  // Auto-scroll story panel when GM speaks
  useEffect(() => {
    const lastMessage = messages.at(-1);
    const isGMMessage = lastMessage?.from?.isLocal === false;

    if (storyScrollRef.current && isGMMessage) {
      storyScrollRef.current.scrollTop = storyScrollRef.current.scrollHeight;
    }
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Get latest GM message for story panel
  const gmMessages = messages.filter(m => m.from?.isLocal === false);
  const latestStory = gmMessages.slice(-3); // Show last 3 GM messages

  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';

  return (
    <section className="relative h-full w-full overflow-hidden bg-[#0a0a0f]" {...props}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(251, 191, 36, 0.3) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(251, 191, 36, 0.3) 2%, transparent 0%)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* TOP HEADER - Compact Status Bar */}
      <div className="relative z-30 border-b border-amber-900/30 bg-black/40 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-3 py-2 md:px-4 md:py-3 flex items-center justify-between gap-2">
          <div className="text-amber-600 font-bold text-xs md:text-sm whitespace-nowrap">🎲 Aetherfall</div>
          
          {/* Agent Status Indicator - Compact */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 justify-center">
            {isSpeaking && (
              <div className="flex items-center gap-1.5 md:gap-2 bg-amber-900/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-amber-600/50">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-amber-300 text-[10px] md:text-xs font-semibold">GM Speaking</span>
              </div>
            )}
            {isListening && (
              <div className="flex items-center gap-1.5 md:gap-2 bg-green-900/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-green-600/50">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-[10px] md:text-xs font-semibold">Listening</span>
              </div>
            )}
            {isThinking && (
              <div className="flex items-center gap-1.5 md:gap-2 bg-purple-900/50 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-purple-600/50">
                <div className="flex gap-0.5 md:gap-1">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-purple-300 text-[10px] md:text-xs font-semibold">Thinking</span>
              </div>
            )}
          </div>

          <div className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap hidden sm:block">LiveKit</div>
        </div>
      </div>

      {/* MAIN CONTENT AREA - Two Column Layout (Desktop) / Stacked (Mobile) */}
      <div className="relative h-[calc(100vh-120px)] overflow-hidden">
        <div className="mx-auto max-w-7xl h-full px-3 py-3 md:px-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-3 md:gap-6 h-full">
            
            {/* LEFT PANEL - Story Text (Primary Content) */}
            <div className="flex flex-col min-h-0 lg:min-h-full">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-lg border border-amber-900/30 shadow-2xl flex flex-col h-full max-h-[40vh] lg:max-h-full">
                <div className="border-b border-amber-900/30 px-3 py-2 md:px-6 md:py-4 flex items-center gap-2 md:gap-3">
                  <span className="text-lg md:text-2xl">🎭</span>
                  <h2 className="text-base md:text-xl font-bold text-amber-500">Game Master's Tale</h2>
                </div>
                
                <ScrollArea ref={storyScrollRef} className="flex-1 px-3 py-3 md:px-6 md:py-4">
                  <div className="space-y-4 md:space-y-6">
                    {latestStory.length > 0 ? (
                      latestStory.map((msg) => (
                        <div key={msg.id} className="space-y-2">
                          <p className="text-gray-100 text-base md:text-lg leading-relaxed font-medium">
                            {msg.message}
                          </p>
                          <div className="h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent"></div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-8 md:py-12 italic text-sm md:text-base">
                        The Game Master prepares your adventure...
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* RIGHT PANEL - Chat & Character Info */}
            <div className="flex flex-col gap-3 md:gap-4 min-h-0 lg:min-h-full">
              
              {/* Chat Transcript */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-lg border border-amber-900/30 shadow-xl flex flex-col flex-1 min-h-[200px] max-h-[30vh] lg:max-h-full">
                <div className="border-b border-amber-900/30 px-3 py-2 md:px-4 md:py-3 flex items-center gap-2">
                  <span className="text-base md:text-lg">💬</span>
                  <h3 className="text-xs md:text-sm font-semibold text-amber-500">Conversation</h3>
                </div>
                
                <ScrollArea ref={chatScrollRef} className="flex-1 px-3 py-2 md:px-4 md:py-3">
                  <ChatTranscript
                    messages={messages}
                    className="space-y-2"
                  />
                </ScrollArea>
              </div>

              {/* Character Sheet - Compact */}
              <div className="hidden lg:block">
                <CharacterSheet />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio visualization */}
      <div className="hidden">
        <TileLayout chatOpen={false} />
      </div>

      {/* BOTTOM CONTROL BAR - Fixed */}
      <MotionBottom
        {...BOTTOM_VIEW_MOTION_PROPS}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-amber-900/30 bg-black/80 backdrop-blur-md"
      >
        {appConfig.isPreConnectBufferEnabled && (
          <PreConnectMessage messages={messages} className="px-2 md:px-4 pt-1 md:pt-2" />
        )}
        <div className="mx-auto max-w-7xl px-2 py-2 md:px-4 md:py-3">
          <AgentControlBar controls={controls} />
        </div>
      </MotionBottom>
    </section>
  );
};
