'use client';

import { useEffect, useState } from 'react';
import { validateSecureContext } from '@/lib/livekit-url';

export function SecurityGuard({ children }: { children: React.ReactNode }) {
  const [securityCheck, setSecurityCheck] = useState<{
    valid: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const result = validateSecureContext();
    setSecurityCheck(result);
  }, []);

  if (securityCheck === null) {
    return null; // Loading
  }

  if (!securityCheck.valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
        <div className="max-w-2xl rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-4 text-6xl">🚨</div>
          <h1 className="mb-4 text-3xl font-bold text-red-600">
            Security Error: HTTPS Required
          </h1>
          <div className="mb-6 space-y-4 text-gray-700">
            <p className="text-lg font-semibold">{securityCheck.error}</p>
            <div className="rounded-lg bg-red-100 p-4">
              <p className="font-semibold">Why this happens:</p>
              <p>
                Browsers block microphone access on non-HTTPS sites (except localhost)
                for security reasons.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="mb-2 font-semibold">✅ Solution:</p>
              <ol className="list-inside list-decimal space-y-2">
                <li>
                  Stop the current server (Ctrl+C)
                </li>
                <li>
                  Run: <code className="rounded bg-gray-200 px-2 py-1">npm run dev:https</code>
                </li>
                <li>
                  Open: <code className="rounded bg-gray-200 px-2 py-1">https://localhost:3000</code>
                </li>
                <li>
                  Accept the self-signed certificate warning in your browser
                </li>
              </ol>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <p className="mb-2 font-semibold">⚠️ Alternative (localhost only):</p>
              <p>
                Access via:{' '}
                <a
                  href="http://localhost:3000"
                  className="font-mono text-blue-600 underline"
                >
                  http://localhost:3000
                </a>
              </p>
              <p className="mt-2 text-sm text-gray-600">
                (This only works on the same computer, not from phones or other devices)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
