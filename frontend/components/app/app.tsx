'use client';

import { useState, useEffect } from 'react';
import { RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionProvider } from '@/components/app/session-provider';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';
import { WellnessLoader } from '@/components/app/wellness-loader';

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for at least 1 second for smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <WellnessLoader />;
  }

  return (
    <SessionProvider appConfig={appConfig}>
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController />
      </main>
      <StartAudio label="Start Audio" />
      <RoomAudioRenderer />
      <Toaster />
    </SessionProvider>
  );
}
