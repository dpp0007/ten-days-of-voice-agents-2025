import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent, TokenSource, RoomOptions } from 'livekit-client';
import { AppConfig } from '@/app-config';
import { toastAlert } from '@/components/livekit/alert-toast';

export function useRoom(appConfig: AppConfig) {
  const aborted = useRef(false);
  const retryCount = useRef(0);
  const maxRetries = 3;
  
  const room = useMemo(() => {
    const roomOptions: RoomOptions = {
      adaptiveStream: true,
      dynacast: true,
      disconnectOnPageLeave: true,
      // Increase timeout for slower connections
      publishDefaults: {
        audioPreset: {
          maxBitrate: 20_000,
        },
      },
      // WebRTC configuration for better connectivity
      webAudioMix: true,
    };
    return new Room(roomOptions);
  }, []);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    function onDisconnected() {
      console.log('🔌 Room disconnected');
      setIsSessionActive(false);
    }

    function onConnected() {
      console.log('✅ Room connected successfully');
    }

    function onReconnecting() {
      console.log('🔄 Room reconnecting...');
    }

    function onReconnected() {
      console.log('✅ Room reconnected');
    }

    function onMediaDevicesError(error: Error) {
      console.error('❌ Media devices error:', error);
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    }

    function onConnectionQualityChanged(quality: any) {
      console.log('📶 Connection quality:', quality);
    }

    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.Reconnecting, onReconnecting);
    room.on(RoomEvent.Reconnected, onReconnected);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.ConnectionQualityChanged, onConnectionQualityChanged);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.Reconnecting, onReconnecting);
      room.off(RoomEvent.Reconnected, onReconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
      room.off(RoomEvent.ConnectionQualityChanged, onConnectionQualityChanged);
    };
  }, [room]);

  useEffect(() => {
    return () => {
      aborted.current = true;
      room.disconnect();
    };
  }, [room]);

  const tokenSource = useMemo(
    () =>
      TokenSource.custom(async () => {
        const url = new URL(
          process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details',
          window.location.origin
        );

        try {
          const res = await fetch(url.toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Sandbox-Id': appConfig.sandboxId ?? '',
            },
            body: JSON.stringify({
              room_config: appConfig.agentName
                ? {
                    agents: [{ agent_name: appConfig.agentName }],
                  }
                : undefined,
            }),
          });
          return await res.json();
        } catch (error) {
          console.error('Error fetching connection details:', error);
          throw new Error('Error fetching connection details!');
        }
      }),
    [appConfig]
  );

  const startSession = useCallback(() => {
    setIsSessionActive(true);

    if (room.state === 'disconnected') {
      const { isPreConnectBufferEnabled } = appConfig;
      
      console.log('🔌 Starting LiveKit session...');
      
      // First get connection details, then connect
      tokenSource
        .fetch({ agentName: appConfig.agentName })
        .then(async (connectionDetails) => {
          console.log('✅ Got connection details:', {
            serverUrl: connectionDetails.serverUrl,
          });
          
          try {
            // Connect to room first
            await room.connect(
              connectionDetails.serverUrl,
              connectionDetails.participantToken,
              {
                autoSubscribe: true,
              }
            );
            
            console.log('✅ Connected to room');
            
            // Then enable microphone
            await room.localParticipant.setMicrophoneEnabled(true, undefined, {
              preConnectBuffer: isPreConnectBufferEnabled,
            });
            
            console.log('✅ Microphone enabled');
          } catch (error) {
            console.error('❌ Connection error:', error);
            throw error;
          }
        })
        .catch((error) => {
          if (aborted.current) {
            // Once the effect has cleaned up after itself, drop any errors
            //
            // These errors are likely caused by this effect rerunning rapidly,
            // resulting in a previous run `disconnect` running in parallel with
            // a current run `connect`
            return;
          }

          console.error('❌ Session start error:', error);
          
          // Retry logic for connection timeouts
          if (retryCount.current < maxRetries && error.message.includes('timeout')) {
            retryCount.current++;
            console.log(`🔄 Retrying connection (${retryCount.current}/${maxRetries})...`);
            
            setTimeout(() => {
              startSession();
            }, 2000 * retryCount.current); // Exponential backoff
            
            return;
          }
          
          // Reset retry count on final failure
          retryCount.current = 0;
          
          let errorMessage = `${error.name}: ${error.message}`;
          
          // Provide helpful error messages
          if (error.message.includes('timeout')) {
            errorMessage = 'Connection timed out. Please check your internet connection and try again.';
          } else if (error.message.includes('permission')) {
            errorMessage = 'Microphone permission denied. Please allow microphone access and refresh the page.';
          } else if (error.message.includes('NotFoundError')) {
            errorMessage = 'No microphone found. Please connect a microphone and try again.';
          }
          
          toastAlert({
            title: 'There was an error connecting to the agent',
            description: errorMessage,
          });
          
          setIsSessionActive(false);
        });
    }
  }, [room, appConfig, tokenSource]);

  const endSession = useCallback(async () => {
    setIsSessionActive(false);
    if (room.state !== 'disconnected') {
      await room.disconnect();
    }
  }, [room]);

  return { room, isSessionActive, startSession, endSession };
}
