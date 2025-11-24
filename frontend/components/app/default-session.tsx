"use client";

import React from "react";
import type { AppConfig } from "@/app-config";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useConnectionTimeout } from "@/hooks/useConnectionTimout";
import { useDebugMode } from "@/hooks/useDebug";
import { useVoiceAssistant, useRoomContext } from "@livekit/components-react";
import { AgentControlBar } from "@/components/livekit/agent-control-bar/agent-control-bar";
import { ChatEntry } from "@/components/livekit/chat-entry";
import SessionScreen from "@/components/app/session-screen";

const IN_DEVELOPMENT = process.env.NODE_ENV !== "production";

interface DefaultSessionProps {
  appConfig: AppConfig;
  onEndSession?: () => void;
}

export const DefaultSessionView = ({
  appConfig,
  onEndSession,
  ...props
}: React.ComponentProps<"section"> & DefaultSessionProps) => {
  useConnectionTimeout(200_000);
  useDebugMode({ enabled: IN_DEVELOPMENT });

  const messages = useChatMessages();
  const { state } = useVoiceAssistant();
  const room = useRoomContext();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const isAgentSpeaking = state === "speaking";
  const isListening = state === "listening";

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get conversation text based on state
  const getConversationText = () => {
    if (isAgentSpeaking) return "Speaking...";
    if (isListening) return "Listening...";
    if (messages.length === 0) return "Ready to begin";
    return "Your wellness session";
  };

  return (
    <SessionScreen
      isAgentSpeaking={isAgentSpeaking}
      isListening={isListening}
      conversationText={getConversationText()}
    >
      <section className="w-full" {...props}>
        {/* Floating Chat Messages - Start from bottom, scroll up */}
        {messages.length > 0 && (
          <div className="fixed inset-x-0 top-32 sm:top-40 bottom-28 sm:bottom-32 z-10 overflow-y-auto px-4 sm:px-6 flex flex-col-reverse">
            <div className="max-w-2xl mx-auto w-full space-y-3 sm:space-y-4 pt-6 sm:pt-8 flex flex-col-reverse">
              {[...messages].reverse().map((msg, index) => {
                const isLocal = msg.from?.identity === room.localParticipant.identity;
                const displayName = isLocal ? 'You' : 'Companion';
                
                return (
                  <ChatEntry
                    key={msg.id || messages.length - 1 - index}
                    locale="en-US"
                    timestamp={msg.timestamp}
                    message={msg.message}
                    messageOrigin={isLocal ? 'local' : 'remote'}
                    name={displayName}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Control Bar - Mobile optimized */}
        <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-4 sm:px-0 sm:w-auto">
          <AgentControlBar
            onEndSession={onEndSession}
            supportsChatInput={false}
            supportsVideoInput={false}
            supportsScreenShare={false}
          />
        </div>
      </section>
    </SessionScreen>
  );
};
