'use client';

import { type HTMLAttributes, useCallback, useState } from 'react';
import { Track } from 'livekit-client';
import { useChat, useRemoteParticipants } from '@livekit/components-react';
import { ChatTextIcon, PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
import { useSession } from '@/components/app/session-provider';
import { TrackToggle } from '@/components/livekit/agent-control-bar/track-toggle';
import { Button } from '@/components/livekit/button';
import { Toggle } from '@/components/livekit/toggle';
import { cn } from '@/lib/utils';
import { ChatInput } from './chat-input';
import { UseInputControlsProps, useInputControls } from './hooks/use-input-controls';
import { usePublishPermissions } from './hooks/use-publish-permissions';
import { TrackSelector } from './track-selector';

export interface ControlBarControls {
  leave?: boolean;
  camera?: boolean;
  microphone?: boolean;
  screenShare?: boolean;
  chat?: boolean;
}

export interface AgentControlBarProps extends UseInputControlsProps {
  controls?: ControlBarControls;
  onDisconnect?: () => void;
  onEndSession?: () => void;
  onChatOpenChange?: (open: boolean) => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
  supportsChatInput?: boolean;
  supportsVideoInput?: boolean;
  supportsScreenShare?: boolean;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  className,
  onDisconnect,
  onEndSession,
  onDeviceError,
  onChatOpenChange,
  supportsChatInput,
  supportsVideoInput,
  supportsScreenShare,
  ...props
}: AgentControlBarProps & HTMLAttributes<HTMLDivElement>) {
  const { send } = useChat();
  const participants = useRemoteParticipants();
  const [chatOpen, setChatOpen] = useState(false);
  const publishPermissions = usePublishPermissions();
  const { isSessionActive, endSession } = useSession();

  const {
    micTrackRef,
    cameraToggle,
    microphoneToggle,
    screenShareToggle,
    handleAudioDeviceChange,
    handleVideoDeviceChange,
    handleMicrophoneDeviceSelectError,
    handleCameraDeviceSelectError,
  } = useInputControls({ onDeviceError, saveUserChoices });

  const handleSendMessage = async (message: string) => {
    await send(message);
  };

  const handleToggleTranscript = useCallback(
    (open: boolean) => {
      setChatOpen(open);
      onChatOpenChange?.(open);
    },
    [onChatOpenChange, setChatOpen]
  );

  const handleDisconnect = useCallback(async () => {
    endSession();
    onDisconnect?.();
    onEndSession?.();
  }, [endSession, onDisconnect, onEndSession]);

  const visibleControls = {
    leave: controls?.leave ?? true,
    microphone: controls?.microphone ?? publishPermissions.microphone,
    screenShare: controls?.screenShare ?? (supportsScreenShare !== false && publishPermissions.screenShare),
    camera: controls?.camera ?? (supportsVideoInput !== false && publishPermissions.camera),
    chat: controls?.chat ?? (supportsChatInput !== false && publishPermissions.data),
  };

  const isAgentAvailable = participants.some((p) => p.isAgent);

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn(
        'flex flex-wrap items-center justify-center gap-2 sm:gap-3',
        className
      )}
      {...props}
    >
      {/* Chat Input */}
      {visibleControls.chat && (
        <ChatInput
          chatOpen={chatOpen}
          isAgentAvailable={isAgentAvailable}
          onSend={handleSendMessage}
        />
      )}

      {/* Microphone Selector Pill - Mobile optimized */}
      {visibleControls.microphone && (
        <div className="flex items-center rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] active:bg-white/30 sm:hover:bg-white/25 transition-all duration-300 p-1.5 sm:p-2 min-h-[44px]">
          <TrackSelector
            kind="audioinput"
            aria-label="Toggle microphone"
            source={Track.Source.Microphone}
            pressed={microphoneToggle.enabled}
            disabled={microphoneToggle.pending}
            audioTrackRef={micTrackRef}
            onPressedChange={microphoneToggle.toggle}
            onMediaDeviceError={handleMicrophoneDeviceSelectError}
            onActiveDeviceChange={handleAudioDeviceChange}
          />
        </div>
      )}

      {/* Other Controls - Mobile optimized */}
      {(visibleControls.camera || visibleControls.screenShare || visibleControls.chat) && (
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] active:bg-white/30 sm:hover:bg-white/25 transition-all duration-300 p-1.5 sm:p-2 min-h-[44px]">
          {/* Toggle Camera */}
          {visibleControls.camera && (
            <TrackSelector
              kind="videoinput"
              aria-label="Toggle camera"
              source={Track.Source.Camera}
              pressed={cameraToggle.enabled}
              pending={cameraToggle.pending}
              disabled={cameraToggle.pending}
              onPressedChange={cameraToggle.toggle}
              onMediaDeviceError={handleCameraDeviceSelectError}
              onActiveDeviceChange={handleVideoDeviceChange}
            />
          )}

          {/* Toggle Screen Share */}
          {visibleControls.screenShare && (
            <TrackToggle
              size="icon"
              variant="secondary"
              aria-label="Toggle screen share"
              source={Track.Source.ScreenShare}
              pressed={screenShareToggle.enabled}
              disabled={screenShareToggle.pending}
              onPressedChange={screenShareToggle.toggle}
            />
          )}

          {/* Toggle Transcript */}
          <Toggle
            size="icon"
            variant="secondary"
            aria-label="Toggle transcript"
            pressed={chatOpen}
            onPressedChange={handleToggleTranscript}
          >
            <ChatTextIcon weight="bold" />
          </Toggle>
        </div>
      )}

      {/* Disconnect Button - Mobile optimized */}
      {visibleControls.leave && (
        <Button
          variant="destructive"
          onClick={handleDisconnect}
          disabled={!isSessionActive}
          className="font-mono rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm min-h-[44px]"
        >
          <PhoneDisconnectIcon weight="bold" className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">END CALL</span>
          <span className="inline sm:hidden">END</span>
        </Button>
      )}
    </div>
  );
}
