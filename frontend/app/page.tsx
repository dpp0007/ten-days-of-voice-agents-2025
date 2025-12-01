import { APP_CONFIG_DEFAULTS } from '@/app-config';
import { App } from '@/app/app';

export default function Home() {
  return <App appConfig={APP_CONFIG_DEFAULTS} />;
}
