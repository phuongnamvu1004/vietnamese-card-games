import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');

    if (!redisUrl) {
      throw new Error('Missing Redis configuration in environment variables.');
    }

    this.client = createClient({
      url: redisUrl,
    });

    this.client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });
  }

  async onModuleInit(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async ping(): Promise<string> {
    try {
      return await this.client.ping();
    } catch (error) {
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Redis ping failed',
      );
    }
  }
}
