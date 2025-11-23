'use client';

import { useState, useEffect } from 'react';
import { RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionProvider } from '@/components/app/session-provider';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';
import { CoffeeLoader } from '@/components/app/coffee-loader';

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
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-b from-[#12B1C5] via-[#8FE4F9] to-[#FFF9EF]">
        <CoffeeLoader />
      </div>
    );
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
