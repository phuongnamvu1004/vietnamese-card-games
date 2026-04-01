import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase';
import type {
  UserStatisticsPhom,
  UserStatisticsSam,
} from './interfaces/user-statistics.interface';
import {
  mapUserStatisticsPhom,
  mapUserStatisticsSam,
} from './mappers/user-statistics.mapper';

@Injectable()
export class UserStatisticsRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getUserStatisticsSamByUserId(
    userId: number,
  ): Promise<UserStatisticsSam | null> {
    const { data, error } = await this.supabaseService.client
      .from('user_statistics_sam')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return null;
    }

    return mapUserStatisticsSam(data as Record<string, unknown>);
  }

  async getUserStatisticsPhomByUserId(
    userId: number,
  ): Promise<UserStatisticsPhom | null> {
    const { data, error } = await this.supabaseService.client
      .from('user_statistics_phom')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return null;
    }

    return mapUserStatisticsPhom(data as Record<string, unknown>);
  }

  async initializeUserStatisticsSam(userId: number): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('user_statistics_sam')
      .insert([
        {
          user_id: userId,
          total_games: 0,
          total_wins: 0,
          instant_wins: {
            dragonStraight: 0,
            fourTwos: 0,
            flushHand: 0,
            threeTriplets: 0,
            fivePairs: 0,
          },
          win_rate: 0,
        },
      ]);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async initializeUserStatisticsPhom(userId: number): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('user_statistics_phom')
      .insert([
        {
          user_id: userId,
          total_games: 0,
          total_wins: 0,
          instant_wins: {
            regular: 0,
            allCard: 0,
            allOdds: 0,
          },
          win_rate: 0,
        },
      ]);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
