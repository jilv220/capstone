import * as Sentry from '@sentry/bun';
import { Conf } from './config.ts';

Sentry.init({
  dsn: 'https://147e6a7bf758f0bd910f6a65e2664542@o4507386025213952.ingest.us.sentry.io/4507386032619520',
  environment: Conf.envType,
  tracesSampleRate: 1.0,
});
