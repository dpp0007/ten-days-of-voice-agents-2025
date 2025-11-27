import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent, TokenSource } from 'livekit-client';
import { AppConfig } from '@/app-config';
import { toastAlert } from '@/components/livekit/alert-toast';

export function useRoom(appConfig: AppConfig) {
  const aborted = useRef(false);
  const room = useMemo(() => new Room(), []);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    function onDisconnected() {
      setIsSessionActive(false);
    }

    function onMediaDevicesError(error: Error) {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    }

    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
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

        console.log('[useRoom] Fetching connection details from:', url.toString());

        try {
          // Import LiveKit URL utilities
          const { getLiveKitHeaders, isLiveKitUrlSafe, getLiveKitUrl } = await import('@/lib/livekit-url');
          
          // Get LiveKit URL and validate it's safe
          const livekitUrl = getLiveKitUrl();
          if (!isLiveKitUrlSafe(livekitUrl)) {
            throw new Error(
              'Cannot connect: Page is loaded over HTTPS but LiveKit server is HTTP. ' +
              'Please set NEXT_PUBLIC_LIVEKIT_URL to an HTTPS endpoint or access the page over HTTP.'
            );
          }

          const headers = {
            'Content-Type': 'application/json',
            'X-Sandbox-Id': appConfig.sandboxId ?? '',
            ...getLiveKitHeaders(),
          };

          console.log('[useRoom] Request headers:', headers);

          const res = await fetch(url.toString(), {
            method: 'POST',
            headers,
            body: JSON.stringify({
              room_config: appConfig.agentName
                ? {
                    agents: [{ agent_name: appConfig.agentName }],
                  }
                : undefined,
            }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error('[useRoom] API error:', res.status, errorText);
            throw new Error(`Failed to get connection details: ${res.status} ${errorText}`);
          }

          const connectionDetails = await res.json();
          console.log('[useRoom] Connection details received:', {
            serverUrl: connectionDetails.serverUrl,
            roomName: connectionDetails.roomName,
          });

          return connectionDetails;
        } catch (error) {
          console.error('[useRoom] Error fetching connection details:', error);
          throw error instanceof Error ? error : new Error('Error fetching connection details!');
        }
      }),
    [appConfig]
  );

  const startSession = useCallback(() => {
    setIsSessionActive(true);

    if (room.state === 'disconnected') {
      const { isPreConnectBufferEnabled } = appConfig;
      Promise.all([
        room.localParticipant.setMicrophoneEnabled(true, undefined, {
          preConnectBuffer: isPreConnectBufferEnabled,
        }),
        tokenSource
          .fetch({ agentName: appConfig.agentName })
          .then((connectionDetails) =>
            room.connect(connectionDetails.serverUrl, connectionDetails.participantToken)
          ),
      ]).catch((error) => {
        if (aborted.current) {
          // Once the effect has cleaned up after itself, drop any errors
          //
          // These errors are likely caused by this effect rerunning rapidly,
          // resulting in a previous run `disconnect` running in parallel with
          // a current run `connect`
          return;
        }

        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      });
    }
  }, [room, appConfig, tokenSource]);

  const endSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

  return { room, isSessionActive, startSession, endSession };
}
