import { Conf } from '@/config';
import ky, { KyInstance } from 'ky';

class KySingleton {
  private static instance: KyInstance | null;

  constructor() {
    if (!KySingleton.instance) {
      KySingleton.instance = ky.create({
        prefixUrl: `${Conf.apiUrl}/api/v1`,
      });
    }
  }

  private static createInstanceIfNotExist() {
    if (!KySingleton.instance) {
      new KySingleton();
    }
  }

  static getInstance(): KyInstance {
    this.createInstanceIfNotExist();
    return KySingleton.instance!;
  }

  static addAuthorizationHeader(sessionToken: string) {
    this.createInstanceIfNotExist();
    KySingleton.instance = KySingleton.instance!.extend({
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
  }

  static clearAuthorizationHeader() {
    this.createInstanceIfNotExist();
    KySingleton.instance = KySingleton.instance!.extend({
      headers: {
        Authorization: undefined,
      },
    });
  }
}

export default KySingleton;
