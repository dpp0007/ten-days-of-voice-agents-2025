import { headers } from 'next/headers';
import { App } from '@/components/app/app';
import { getAppConfig } from '@/lib/utils';
import { Suspense } from 'react';

export default async function Page() {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-lg text-gray-700">Initializing B2B Lead Agent…</p>
        </div>
      </div>
    }>
      <App appConfig={appConfig} />
    </Suspense>
  );
}
