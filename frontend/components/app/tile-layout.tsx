import React, { useMemo } from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarVisualizer,
  type TrackReference,
  VideoTrack,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { AnimatedSphere } from './animated-sphere';
import { VoiceWaveform } from './voice-waveform';

const MotionContainer = motion.create('div');

const ANIMATION_TRANSITION = {
  type: 'spring',
  stiffness: 675,
  damping: 75,
  mass: 1,
};

const classNames = {
  // GRID
  // 2 Columns x 3 Rows
  grid: [
    'h-full w-full',
    'grid gap-x-2 place-content-center',
    'grid-cols-[1fr_1fr] grid-rows-[90px_1fr_90px]',
  ],
  // Agent
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 1 / Row 1
  // align: x-end y-center
  agentChatOpenWithSecondTile: ['col-start-1 row-start-1', 'self-center justify-self-end'],
  // Agent
  // chatOpen: true,
  // hasSecondTile: false
  // layout: Column 1 / Row 1 / Column-Span 2
  // align: x-center y-center
  agentChatOpenWithoutSecondTile: ['col-start-1 row-start-1', 'col-span-2', 'place-content-center'],
  // Agent
  // chatOpen: false
  // layout: Column 1 / Row 1 / Column-Span 2 / Row-Span 3
  // align: x-center y-center
  agentChatClosed: ['col-start-1 row-start-1', 'col-span-2 row-span-3', 'place-content-center'],
  // Second tile
  // chatOpen: true,
  // hasSecondTile: true
  // layout: Column 2 / Row 1
  // align: x-start y-center
  secondTileChatOpen: ['col-start-2 row-start-1', 'self-center justify-self-start'],
  // Second tile
  // chatOpen: false,
  // hasSecondTile: false
  // layout: Column 2 / Row 2
  // align: x-end y-end
  secondTileChatClosed: ['col-start-2 row-start-3', 'place-content-end'],
};

export function useLocalTrackRef(source: Track.Source) {
  const { localParticipant } = useLocalParticipant();
  const publication = localParticipant.getTrackPublication(source);
  const trackRef = useMemo<TrackReference | undefined>(
    () => (publication ? { source, participant: localParticipant, publication } : undefined),
    [source, publication, localParticipant]
  );
  return trackRef;
}

interface TileLayoutProps {
  chatOpen: boolean;
}

export function TileLayout({ chatOpen }: TileLayoutProps) {
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant();
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);
  const cameraTrack: TrackReference | undefined = useLocalTrackRef(Track.Source.Camera);

  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareEnabled = screenShareTrack && !screenShareTrack.publication.isMuted;
  const hasSecondTile = isCameraEnabled || isScreenShareEnabled;

  const animationDelay = chatOpen ? 0 : 0.15;
  const isAvatar = agentVideoTrack !== undefined;
  const videoWidth = agentVideoTrack?.publication.dimensions?.width ?? 0;
  const videoHeight = agentVideoTrack?.publication.dimensions?.height ?? 0;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {/* Main Animated Sphere - Centered and Dominant */}
        <AnimatePresence mode="popLayout">
          {!isAvatar && (
            <MotionContainer
              key="agent-sphere"
              layoutId="agent-sphere"
              initial={{
                opacity: 0,
                y: 0,
              }}
              animate={{
                opacity: 1,
                y: chatOpen ? -120 : 0,
              }}
              transition={{
                ...ANIMATION_TRANSITION,
                delay: animationDelay,
              }}
              className="relative h-[500px] w-[500px] md:h-[600px] md:w-[600px]"
            >
              <AnimatedSphere className="h-full w-full" />
            </MotionContainer>
          )}

          {isAvatar && (
            // Avatar Agent
            <MotionContainer
              key="avatar"
              layoutId="avatar"
              initial={{
                scale: 0.5,
                opacity: 0,
              }}
              animate={{
                scale: chatOpen ? 0.5 : 1,
                opacity: 1,
              }}
              transition={{
                ...ANIMATION_TRANSITION,
                delay: animationDelay,
              }}
              className={cn(
                'glass-strong overflow-hidden rounded-3xl shadow-2xl',
                chatOpen ? 'h-[200px] w-[200px]' : 'h-[400px] w-[400px] md:h-[500px] md:w-[500px]'
              )}
            >
              <VideoTrack
                width={videoWidth}
                height={videoHeight}
                trackRef={agentVideoTrack}
                className="h-full w-full object-cover"
              />
            </MotionContainer>
          )}
        </AnimatePresence>

        {/* Voice Waveform - Centered in Sphere with Pulse */}
        {!isAvatar && (
          <MotionContainer
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: chatOpen ? 0 : 1,
              y: chatOpen ? -120 : 0,
              scale: chatOpen ? 0.8 : [1, 1.05, 1],
            }}
            transition={{
              duration: 0.5,
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[100px] w-[400px] md:w-[500px]"
          >
            <VoiceWaveform className="h-full w-full" />
          </MotionContainer>
        )}

        {/* Camera & Screen Share - Glassmorphic Floating Tile */}
        <AnimatePresence>
          {((cameraTrack && isCameraEnabled) || (screenShareTrack && isScreenShareEnabled)) && (
            <MotionContainer
              key="camera"
              initial={{
                opacity: 0,
                scale: 0.8,
                x: 100,
                y: -100,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: chatOpen ? 0 : 250,
                y: chatOpen ? 0 : -150,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                ...ANIMATION_TRANSITION,
                delay: animationDelay,
              }}
              className="glass-strong pointer-events-auto fixed right-8 top-24 overflow-hidden rounded-2xl shadow-2xl"
            >
              <VideoTrack
                trackRef={cameraTrack || screenShareTrack}
                width={(cameraTrack || screenShareTrack)?.publication.dimensions?.width ?? 0}
                height={(cameraTrack || screenShareTrack)?.publication.dimensions?.height ?? 0}
                className="h-[160px] w-[160px] object-cover md:h-[200px] md:w-[200px]"
              />
            </MotionContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
