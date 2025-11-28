import { headers } from 'next/headers';
import { GroceryVoiceApp } from '@/components/grocery-voice-app';
import { getAppConfig } from '@/lib/utils';

export default async function Page() {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return <GroceryVoiceApp appConfig={appConfig} />;
}
