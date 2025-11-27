import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// Environment variables
const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// Don't cache the results
export const revalidate = 0;

/**
 * Determines the correct LiveKit URL to return to the client
 * This handles the protocol upgrade and ensures mobile compatibility
 */
function getClientLiveKitUrl(requestHeaders: Headers): string {
  // Check if client provided a preferred URL (for mobile/network access)
  const clientUrl = requestHeaders.get('x-livekit-url');
  if (clientUrl) {
    console.log('[Connection API] Using client-provided LiveKit URL:', clientUrl);
    return clientUrl;
  }

  // Use server-configured URL
  if (!LIVEKIT_URL) {
    throw new Error('LIVEKIT_URL is not configured');
  }

  console.log('[Connection API] Using server LiveKit URL:', LIVEKIT_URL);
  return LIVEKIT_URL;
}

export async function POST(req: Request) {
  try {
    console.log('[Connection API] Received connection request');

    // Validate environment
    if (!API_KEY) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (!API_SECRET) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }
    if (!LIVEKIT_URL) {
      throw new Error('LIVEKIT_URL is not defined');
    }

    // Parse agent configuration
    const body = await req.json();
    const agentName: string = body?.room_config?.agents?.[0]?.agent_name;

    // Generate participant details
    const participantName = 'user';
    const participantIdentity = `fraud_alert_user_${Math.floor(Math.random() * 10_000)}`;
    const roomName = `fraud_alert_room_${Math.floor(Math.random() * 10_000)}`;

    console.log('[Connection API] Creating room:', roomName);

    // Create participant token
    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      agentName
    );

    // Get the appropriate LiveKit URL for the client
    const serverUrl = getClientLiveKitUrl(req.headers);

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl,
      roomName,
      participantToken,
      participantName,
    };

    console.log('[Connection API] Connection details created successfully');
    console.log('[Connection API] Server URL:', serverUrl);
    console.log('[Connection API] Room:', roomName);

    const headers = new Headers({
      'Cache-Control': 'no-store',
    });

    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error('[Connection API] Error:', error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse('Internal server error', { status: 500 });
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName?: string
): Promise<string> {
  const at = new AccessToken(API_KEY, API_SECRET, {
    ...userInfo,
    ttl: '15m',
  });

  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };

  at.addGrant(grant);

  if (agentName) {
    at.roomConfig = new RoomConfiguration({
      agents: [{ agentName }],
    });
  }

  return at.toJwt();
}
