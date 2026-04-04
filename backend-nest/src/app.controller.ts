import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health/supabase')
  getDatabaseHealth() {
    return this.appService.getDatabaseHealth();
  }

  @Get('health/redis')
  getRedisHealth() {
    return this.appService.getRedisHealth();
  }
}
