import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function POST(request: NextRequest) {
  try {
    // Get environment variables
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    // Validate environment variables
    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('Missing LiveKit environment variables:', {
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        hasWsUrl: !!wsUrl,
      });
      return NextResponse.json(
        { error: 'Server configuration error: Missing LiveKit credentials' },
        { status: 500 }
      );
    }

    // Parse request body (optional)
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body is optional, continue with defaults
    }

    // Generate room name (use provided or generate new)
    const roomName = body.roomName || `improv-battle-${Date.now()}`;

    // Generate unique identity (use provided or generate new)
    const identity = body.identity || `user-${Math.random().toString(36).substring(7)}`;

    // Get player name from localStorage (passed from frontend)
    // This will be used by the voice agent to address the player
    const name = body.name || body.playerName || identity;

    // Create access token
    const token = new AccessToken(apiKey, apiSecret, {
      identity,
      name,
      ttl: '10h', // Token valid for 10 hours
    });

    // Grant permissions
    token.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    // Generate JWT
    const jwt = await token.toJwt();

    // Log success
    console.log('✅ Generated LiveKit token:', {
      roomName,
      identity,
      name,
      wsUrl,
    });

    // Return connection details
    return NextResponse.json({
      serverUrl: wsUrl,
      roomName,
      identity,
      participantToken: jwt,
      participantName: name,
    });
  } catch (error) {
    console.error('❌ Error generating LiveKit token:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate connection details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Support GET requests with query parameters (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName') || undefined;
    const identity = searchParams.get('identity') || undefined;
    const name = searchParams.get('name') || undefined;

    // Create a mock request body and call POST handler
    const mockRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ roomName, identity, name }),
    });

    return POST(mockRequest as NextRequest);
  } catch (error) {
    console.error('❌ Error in GET handler:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
