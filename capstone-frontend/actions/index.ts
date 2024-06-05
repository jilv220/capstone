import { Conf } from '@/config';

export type Provider = 'google' | 'github';
export type IdTokenOptions = {
  idToken: string;
  provider: Provider;
  user?: {
    username: string;
  };
};

export const BASE_URL = `${Conf.apiUrl}/api/v1`;
