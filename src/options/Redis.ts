import { createClient, RedisClientType } from 'redis';
import { NODE_ENV } from '../config/config';

export class Redis {
  private static client: RedisClientType;
  private static connected: boolean = false;

  public static async initialize() {
    if (!Redis.connected) {
      Redis.client = createClient();

      return Redis.client
        .connect()
        .then(() => {
          Redis.connected = true;
          console.info(`Redis connected ${NODE_ENV}`);
        })
        .catch((e: any) => {
          console.error('Redis Client Error', e);
        });
    }
  }

  public static getClient() {
    return Redis.client;
  }

  public static async disconnect() {
    if (Redis.connected) {
      await Redis.client.quit();
      Redis.connected = false;
    }
  }
}
