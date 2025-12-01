import type { Metadata } from 'next';
import { APP_CONFIG_DEFAULTS } from '@/app-config';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Improv Battle - Voice Game Show',
  description: 'Voice-First Improv Game Show powered by Murf Falcon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
