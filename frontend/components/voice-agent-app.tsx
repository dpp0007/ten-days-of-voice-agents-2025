'use client';

import type { AppConfig } from '@/app-config';
import { SessionProvider } from '@/components/app/session-provider';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';

interface VoiceAgentAppProps {
  appConfig: AppConfig;
}

export function VoiceAgentApp({ appConfig }: VoiceAgentAppProps) {
  return (
    <SessionProvider appConfig={appConfig}>
      <ViewController />
      <Toaster />
    </SessionProvider>
  );
}
