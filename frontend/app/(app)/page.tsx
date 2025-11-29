import { headers } from 'next/headers';
import { VoiceAgentApp } from '@/components/voice-agent-app';
import { getAppConfig } from '@/lib/utils';

export default async function Page() {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);

  return <VoiceAgentApp appConfig={appConfig} />;
}
