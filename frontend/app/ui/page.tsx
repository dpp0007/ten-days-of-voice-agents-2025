import { headers } from 'next/headers';
import { VoiceShoppingUI } from '@/components/voice-shopping-ui';
import { getAppConfig } from '@/lib/utils';

export default async function UIPage() {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return <VoiceShoppingUI appConfig={appConfig} />;
}
