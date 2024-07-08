import './sentry.ts';

import app from './app.ts';
import { Conf } from './config.ts';

Bun.serve({ port: Conf.PORT, fetch: app.fetch });
