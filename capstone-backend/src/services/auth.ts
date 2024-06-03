import { lucia } from '@/db/lucia.ts';
import { RegisteredDatabaseSessionAttributes } from 'lucia';

export class AuthService {
  static async validateSession(sessionToken: string) {
    return await lucia.validateSession(sessionToken);
  }

  static async createSession(userId: string, attributes: RegisteredDatabaseSessionAttributes) {
    return await lucia.createSession(userId, attributes);
  }
}
