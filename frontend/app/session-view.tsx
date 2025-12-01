'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { AppConfig } from '@/app-config';
import { PreConnectMessage } from '@/app/preconnect-message';
import { TileLayout } from '@/app/tile-layout';
import {
  AgentControlBar,
  type ControlBarControls,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useConnectionTimeout } from '@/hooks/useConnectionTimout';
import { useDebugMode } from '@/hooks/useDebug';
import { cn } from '@/lib/utils';

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
  initial: 'hidden' as const,
  animate: 'visible' as const,
  exit: 'hidden' as const,
  transition: {
    duration: 0.3,
    delay: 0.5,
  },
};

interface FadeProps {
  top?: boolean;
  bottom?: boolean;
  className?: string;
}

export function Fade({ top = false, bottom = false, className }: FadeProps) {
  return (
    <div
      className={cn(
        'from-background pointer-events-none h-4 bg-linear-to-b to-transparent',
        top && 'bg-linear-to-b',
        bottom && 'bg-linear-to-t',
        className
      )}
    />
  );
}

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
  const [chatOpen, setChatOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [playerName, setPlayerName] = useState('');
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    // Get player name from localStorage
    if (typeof window !== 'undefined') {
      const name = localStorage.getItem('playerName');
      if (name) setPlayerName(name);
    }
  }, []);

  // Detect round changes from agent messages
  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (lastMessage && !lastMessage.from?.isLocal) {
      const text = lastMessage.message.toLowerCase();
      // Look for "round X" patterns
      const roundMatch = text.match(/\b(?:round|scene)\s+(\d+)\b/i);
      if (roundMatch) {
        const detectedRound = parseInt(roundMatch[1], 10);
        if (detectedRound > 0 && detectedRound <= 5) {
          setCurrentRound(detectedRound);
        }
      }
    }
  }, [messages]);

  const controls: ControlBarControls = {
    leave: true,
    microphone: true,
    chat: appConfig.supportsChatInput,
    camera: appConfig.supportsVideoInput,
    screenShare: appConfig.supportsVideoInput,
  };

  useEffect(() => {
    const lastMessage = messages.at(-1);
    const lastMessageIsLocal = lastMessage?.from?.isLocal === true;

    if (scrollAreaRef.current && lastMessageIsLocal) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="pixel-sky-bg relative z-10 h-full w-full overflow-hidden" {...props}>
      {/* Pixel Stars */}
      <div
        className="pixel-star"
        style={{ width: '3px', height: '3px', top: '8%', left: '12%', animationDelay: '0s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '2px',
          height: '2px',
          top: '18%',
          left: '85%',
          animationDelay: '1s',
          background: '#FFD166',
        }}
      />
      <div
        className="pixel-star"
        style={{ width: '4px', height: '4px', top: '25%', left: '30%', animationDelay: '2s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '3px',
          height: '3px',
          top: '12%',
          left: '65%',
          animationDelay: '1.5s',
          background: '#9D7CFF',
        }}
      />
      <div
        className="pixel-star"
        style={{ width: '2px', height: '2px', top: '35%', left: '92%', animationDelay: '0.5s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '3px',
          height: '3px',
          top: '55%',
          left: '8%',
          animationDelay: '2.5s',
          background: '#FFD166',
        }}
      />
      <div
        className="pixel-star"
        style={{ width: '4px', height: '4px', top: '65%', left: '75%', animationDelay: '1.2s' }}
      />
      <div
        className="pixel-star"
        style={{
          width: '2px',
          height: '2px',
          top: '75%',
          left: '45%',
          animationDelay: '3s',
          background: '#9D7CFF',
        }}
      />
      <div
        className="pixel-star"
        style={{ width: '3px', height: '3px', top: '85%', left: '20%', animationDelay: '0.8s' }}
      />

      {/* Floating Blocks */}
      <div
        className="pixel-block"
        style={{
          width: '8px',
          height: '8px',
          bottom: '-50px',
          left: '15%',
          animationDelay: '0s',
          animationDuration: '30s',
        }}
      />
      <div
        className="pixel-block"
        style={{
          width: '10px',
          height: '10px',
          bottom: '-70px',
          left: '55%',
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
          left: '88%',
          animationDelay: '10s',
          animationDuration: '28s',
        }}
      />
      <div
        className="pixel-block"
        style={{
          width: '12px',
          height: '12px',
          bottom: '-80px',
          left: '35%',
          animationDelay: '15s',
          animationDuration: '32s',
        }}
      />
      <div
        className="pixel-block"
        style={{
          width: '7px',
          height: '7px',
          bottom: '-40px',
          left: '70%',
          animationDelay: '8s',
          animationDuration: '29s',
        }}
      />

      {/* Dark overlay for contrast */}
      <div className="pixel-sky-overlay" />

      {/* Mobile Root Container */}
      <div className="mobile-root lg:hidden">
        {/* HEADER - HUD Bar */}
        <header className="mobile-hud">
          <div
            className="flex items-center justify-between"
            style={{
              backgroundColor: '#060B21',
              border: '2px solid #252D55',
              borderRadius: '2px',
              padding: '8px 10px',
              minHeight: '40px',
            }}
          >
            <div className="flex items-center gap-1.5 lg:gap-2">
              <div
                className="blink h-1.5 w-1.5 lg:h-2 lg:w-2"
                style={{
                  backgroundColor: '#E95353',
                  borderRadius: '1px',
                }}
              />
              <span className="text-xs font-bold lg:text-xs" style={{ color: '#E95353' }}>
                ON AIR
              </span>
            </div>

            <span
              className="mobile-hud-title"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '9px',
                color: '#F7F5EF',
                letterSpacing: '0.5px',
              }}
            >
              IMPROV BATTLE
            </span>

            <div className="flex items-center gap-0.5 lg:gap-1">
              <span style={{ color: '#E95353', fontSize: '12px', lineHeight: '1' }}>♥</span>
              <span style={{ color: '#E95353', fontSize: '12px', lineHeight: '1' }}>♥</span>
              <span style={{ color: '#E95353', fontSize: '12px', lineHeight: '1' }}>♥</span>
            </div>
          </div>
        </header>

        {/* CHAT SECTION - Mobile */}
        <section className="mobile-chat-area">
          <div
            style={{
              backgroundColor: '#111A3D',
              border: '2px solid #C29CFF',
              borderRadius: '2px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: '#C29CFF' }}>
                HOST
              </span>
              <div
                className="px-2 py-1 text-xs font-bold"
                style={{
                  backgroundColor: '#F9D66B',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '2px',
                }}
              >
                Round {currentRound} / 3
              </div>
            </div>

            {/* Waveform */}
            <div className="mb-3 flex h-4 items-end gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="wave-bar flex-1 rounded-sm"
                  style={{
                    backgroundColor: '#4AD4C6',
                    height: '4px',
                  }}
                />
              ))}
            </div>

            {/* Messages */}
            <div
              ref={scrollAreaRef}
              className="flex-1 space-y-3 overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#4AD4C6 #0C1635',
              }}
            >
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.from?.isLocal ? (
                    <div className="flex justify-end">
                      <div
                        className="max-w-[90%]"
                        style={{
                          backgroundColor: '#1A3A52',
                          border: '2px solid #4AD4C6',
                          borderRadius: '8px 8px 2px 8px',
                          padding: '10px 12px',
                        }}
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <div
                            className="h-1.5 w-1.5"
                            style={{
                              backgroundColor: '#4AD4C6',
                              borderRadius: '1px',
                            }}
                          />
                          <span className="text-[10px] font-bold" style={{ color: '#4AD4C6' }}>
                            YOU
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: '#F7F5EF' }}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundColor: '#0C1635',
                        border: '2px solid #C29CFF',
                        borderRadius: '4px',
                        padding: '12px',
                      }}
                    >
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                            fill="#C29CFF"
                          />
                        </svg>
                        <span className="text-[10px] font-bold" style={{ color: '#C29CFF' }}>
                          HOST
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#F7F5EF' }}>
                        {msg.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLAYER STRIP - Mobile */}
        <section className="mobile-player-strip">
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: '#9BA4CF' }}>
              🎮
            </span>
            <div className="text-sm font-bold" style={{ color: '#F7F5EF' }}>
              {playerName || 'Player'}
            </div>
          </div>
          <div
            className="px-3 py-1 text-xs font-bold"
            style={{
              backgroundColor: '#F9D66B',
              color: '#000',
              border: '2px solid #000',
              borderRadius: '4px',
            }}
          >
            Round {currentRound} / 3
          </div>
        </section>
      </div>

      {/* Desktop Layout (hidden on mobile) */}
      <div className="relative z-10 hidden lg:mx-auto lg:flex lg:max-w-[1200px] lg:flex-row lg:gap-4 lg:p-4 lg:pb-28">
        <div className="lg:flex lg:flex-[7] lg:flex-col lg:gap-3">
          <div
            className="flex items-center justify-between px-3 py-1.5"
            style={{
              backgroundColor: '#060B21',
              border: '2px solid #252D55',
              borderRadius: '2px',
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="blink h-2 w-2"
                style={{
                  backgroundColor: '#E95353',
                  borderRadius: '1px',
                }}
              />
              <span className="text-xs font-bold" style={{ color: '#E95353' }}>
                ON AIR
              </span>
            </div>

            <span
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '9px',
                color: '#F7F5EF',
                letterSpacing: '0.5px',
              }}
            >
              IMPROV BATTLE
            </span>

            <div className="flex items-center gap-1">
              <span style={{ color: '#E95353', fontSize: '12px', lineHeight: '1' }}>♥</span>
              <span style={{ color: '#E95353', fontSize: '12px', lineHeight: '1' }}>♥</span>
              <span style={{ color: '#E95353', fontSize: '12px', lineHeight: '1' }}>♥</span>
            </div>
          </div>

          {/* Host Card - Desktop */}
          <div
            className="mobile-host-panel flex-1 overflow-hidden border-4 border-[#C29CFF] p-4 lg:p-6"
            style={{
              backgroundColor: '#111A3D',
              borderRadius: '2px',
              boxShadow:
                '0 0 30px rgba(194, 156, 255, 0.3), 0 20px 60px rgba(0, 0, 0, 0.6), 6px 6px 0px rgba(0, 0, 0, 0.4)',
              minHeight: 0,
            }}
          >
            <div className="mb-3 flex items-center justify-between lg:mb-3">
              <span className="text-sm font-bold lg:text-sm" style={{ color: '#C29CFF' }}>
                HOST
              </span>
              <div
                className="px-3 py-1 text-xs font-bold lg:px-3 lg:py-1 lg:text-xs"
                style={{
                  backgroundColor: '#F9D66B',
                  color: '#000',
                  border: '2px solid #000',
                  borderRadius: '2px',
                }}
              >
                Round {currentRound} / 3
              </div>
            </div>

            {/* Pixel Waveform - Mobile Reduced */}
            <div className="mobile-waveform mb-3 flex h-4 items-end gap-1 lg:mb-4 lg:h-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="wave-bar flex-1 rounded-sm"
                  style={{
                    backgroundColor: '#4AD4C6',
                    height: '4px',
                  }}
                />
              ))}
            </div>

            {/* Messages Area - Mobile Optimized */}
            <div
              ref={scrollAreaRef}
              className="mobile-messages max-h-[300px] space-y-3 overflow-y-auto pr-2 lg:max-h-[450px] lg:space-y-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#4AD4C6 #0C1635',
              }}
            >
              {messages.map((msg, idx) => (
                <div key={idx}>
                  {msg.from?.isLocal ? (
                    /* PLAYER MESSAGE - Speech Bubble */
                    <div className="flex justify-end">
                      <div
                        className="mobile-message-player max-w-[90%] lg:max-w-[75%]"
                        style={{
                          backgroundColor: '#1A3A52',
                          border: '2px solid #4AD4C6',
                          borderRadius: '8px 8px 2px 8px',
                          padding: '12px 16px',
                          boxShadow: '0 2px 8px rgba(74, 212, 198, 0.2)',
                        }}
                      >
                        <div className="mb-1 flex items-center gap-1.5">
                          <div
                            className="h-1.5 w-1.5 lg:h-2 lg:w-2"
                            style={{
                              backgroundColor: '#4AD4C6',
                              borderRadius: '1px',
                            }}
                          />
                          <span
                            className="text-[10px] font-bold lg:text-xs"
                            style={{ color: '#4AD4C6' }}
                          >
                            YOU
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#F7F5EF' }}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* HOST MESSAGE - Full Width Broadcast */
                    <div
                      className="mobile-message-host w-full"
                      style={{
                        backgroundColor: '#0C1635',
                        border: '2px solid #C29CFF',
                        borderRadius: '4px',
                        padding: '16px',
                        boxShadow:
                          '0 0 20px rgba(194, 156, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <div className="mb-1.5 flex items-center gap-1.5 lg:mb-2 lg:gap-2">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="lg:h-[14px] lg:w-[14px]"
                          style={{ flexShrink: 0 }}
                        >
                          <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                            fill="#C29CFF"
                          />
                        </svg>
                        <span
                          className="text-[10px] font-bold tracking-wide lg:text-xs"
                          style={{ color: '#C29CFF' }}
                        >
                          HOST
                        </span>
                        <div
                          className="ml-auto h-1.5 w-1.5 rounded-full lg:h-2 lg:w-2"
                          style={{ backgroundColor: '#F9D66B' }}
                        />
                      </div>
                      <p
                        className="text-sm leading-relaxed lg:text-base"
                        style={{
                          color: '#F7F5EF',
                          lineHeight: '1.6',
                        }}
                      >
                        {msg.message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Panel - Softer, Less Competing */}
        <div className="flex flex-shrink-0 flex-col gap-2 lg:flex-[3] lg:gap-3">
          {/* Player Name and Round Detail Section */}
          <div
            className="mobile-player-status p-3 lg:border-2 lg:border-[#4AD4C6] lg:bg-[#111A3D]"
            style={{
              borderRadius: '8px',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: '#9BA4CF' }}>
                🎮
              </span>
              <div className="text-sm font-bold" style={{ color: '#F7F5EF' }}>
                {playerName || 'Player'}
              </div>
            </div>
            <div
              className="px-3 py-1 text-xs font-bold"
              style={{
                backgroundColor: '#F9D66B',
                color: '#000',
                border: '2px solid #000',
                borderRadius: '4px',
              }}
            >
              Round {currentRound} / 3
            </div>
          </div>

          {/* Scene Progress */}
          <div
            className="hidden p-3 lg:block"
            style={{
              backgroundColor: '#111A3D',
              border: '2px solid #252D55',
              borderRadius: '2px',
            }}
          >
            <div className="mb-2 text-xs font-bold" style={{ color: '#9BA4CF' }}>
              SCENE PROGRESS
            </div>
            <div className="space-y-1.5">
              {[1, 2, 3].map((round) => (
                <div
                  key={round}
                  className="flex items-center gap-2 text-xs"
                  style={{
                    color:
                      round === currentRound
                        ? '#F9D66B'
                        : round < currentRound
                          ? '#4AD4C6'
                          : '#9BA4CF',
                  }}
                >
                  {round < currentRound && <span>✓</span>}
                  <span>Round {round}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rules - Hidden on Mobile */}
          <div
            className="hidden p-3 lg:block"
            style={{
              backgroundColor: '#111A3D',
              border: '2px solid #252D55',
              borderRadius: '2px',
            }}
          >
            <div className="mb-2 text-xs font-bold" style={{ color: '#9BA4CF' }}>
              RULES
            </div>
            <ul className="space-y-1.5 text-xs" style={{ color: '#9BA4CF' }}>
              <li>• Stay in character</li>
              <li>• Go big with choices</li>
              <li>• Say "end scene" to switch</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden Tile Layout for LiveKit */}
      <div className="hidden">
        <TileLayout chatOpen={chatOpen} />
      </div>

      {/* Bottom Control Bar - Mobile Fixed */}
      <MotionBottom {...BOTTOM_VIEW_MOTION_PROPS} className="fixed inset-x-0 bottom-0 z-50">
        <div className="mobile-bottom-bar flex flex-col gap-2 px-4 py-3">
          {/* Instruction Text - Hidden on Mobile */}
          <div className="hidden text-center lg:block">
            <p className="text-xs" style={{ color: '#9BA4CF' }}>
              Speak your scene. Say &quot;end scene&quot; when you&apos;re done.
            </p>
          </div>

          {appConfig.isPreConnectBufferEnabled && (
            <PreConnectMessage messages={messages} className="pb-1 lg:pb-2" />
          )}

          {/* Control Bar - Touch Optimized */}
          <div className="relative mx-auto w-full max-w-2xl">
            <AgentControlBar controls={controls} onChatOpenChange={setChatOpen} />
          </div>
        </div>
      </MotionBottom>
    </section>
  );
};
