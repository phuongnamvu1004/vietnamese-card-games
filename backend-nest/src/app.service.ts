import { Injectable } from '@nestjs/common';
import { RedisService } from './database/redis';
import { SupabaseService } from './database/supabase';

@Injectable()
export class AppService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly redisService: RedisService,
  ) {}

  getHello(): string {
    return 'This is an API for Vietnamese Card Games';
  }

  async getDatabaseHealth(): Promise<{ status: string; database: string }> {
    await this.supabaseService.testConnection();
    return {
      status: 'ok',
      database: 'connected',
    };
  }

  async getRedisHealth(): Promise<{ status: string; redis: string }> {
    await this.redisService.ping();
    return {
      status: 'ok',
      redis: 'connected',
    };
  }
}
