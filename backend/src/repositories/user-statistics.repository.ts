import { log } from "../lib/utils/logger";
import { mapUserStatisticsPhom, mapUserStatisticsSam } from "../mappers/user-statistics.mapper";
import { SupabaseClient } from "@supabase/supabase-js";
import { IUserStatisticsRepository } from "../interfaces/repositories/user-statistics-repository";
import { supabase } from "../databases/supabase";
import { InstantWinType } from "../game/sam/rules/check-instant-win";

export class UserStatisticsRepository implements IUserStatisticsRepository{
  constructor(
    private readonly _db: SupabaseClient
  ) {}

  async getUserStatisticsSamByUserId (userId: number) {
    const { data, error } = await this._db
      .from("user_statistics_sam")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      log(
        "getUserStatisticsSamByUserId:",
        error?.message,
        error?.details,
        "error",
      );
      return null;
    }

    log("getUserStatisticsSamByUserId:", mapUserStatisticsSam(data), "info");

    return mapUserStatisticsSam(data);
  };

  async getUserStatisticsPhomByUserId (userId: number) {
    const { data, error } = await this._db
      .from("user_statistics_phom")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      log(
        "getUserStatisticsPhomByUserId:",
        error?.message,
        error?.details,
        "error",
      );
      return null;
    }

    log("getUserStatisticsPhomByUserId:", mapUserStatisticsPhom(data), "info");

    return mapUserStatisticsPhom(data);
  };

  async initializeUserStatisticsSam (userId: number)  {
    const { data, error } = await this._db
      .from("user_statistics_sam")
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
      ])
      .select()
      .single();

    if (error || !data) {
      log(
        "initializeUserStatisticsSam error:",
        error?.message,
        error?.details,
        "error",
      );
    } else {
      log("initializeUserStatisticsSam:", data, "info");
    }
  };

  async initializeUserStatisticsPhom (userId: number) {
    const { data, error } = await this._db
      .from("user_statistics_phom")
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
      ])
      .select()
      .single();

    if (error || !data) {
      log(
        "initializeUserStatisticsPhom error:",
        error?.message,
        error?.details,
        "error",
      );
    } else {
      log("initializeUserStatisticsPhom:", data, "info");
    }
  };

  async updateSamStatsWins(userId: number, winsInc: number, gamesInc: number) {
    const { data, error } = await this._db
      .rpc("update_sam_stats_wins", {
        p_user_id: userId,
        p_wins_inc: winsInc,
        p_games_inc: gamesInc
      })
      .single();

    if (error) {
      log(
        "updateSamStatsWins error:",
        error?.message,
        error?.details,
        "error",
      );
      return null;
    }

    return mapUserStatisticsSam(data as Record<string, unknown>);
  }

  async updateSamStatsInstantWins(userId: number, instantWins: Record<InstantWinType, number>) {
    const { data, error } = await this._db
      .rpc("update_sam_stats_instant_wins", {
        p_user_id: userId,
        p_dragon_straight_inc: instantWins[InstantWinType.DragonStraight] || 0,
        p_four_twos_inc: instantWins[InstantWinType.FourTwos] || 0,
        p_flush_hand_inc: instantWins[InstantWinType.FlushHand] || 0,
        p_three_triplets_inc: instantWins[InstantWinType.ThreeTriplets] || 0,
        p_five_pairs_inc: instantWins[InstantWinType.FivePairs] || 0,
      })
      .single();

    if (error) {
      log(
        "updateSamStatsInstantWins error:",
        error?.message,
        error?.details,
        "error",
      );
      return null;
    }

    return mapUserStatisticsSam(data as Record<string, unknown>);
  }
  async updateUserStatisticsPhom () {
    // TODO
  };
}

// Exports for leave-room.handler
export const userStatisticsRepository = new UserStatisticsRepository(supabase);
export const updateSamStatsWins = (...args: Parameters<UserStatisticsRepository["updateSamStatsWins"]>) =>
  userStatisticsRepository.updateSamStatsWins(...args);

export const updateSamStatsInstantWins = (...args: Parameters<UserStatisticsRepository["updateSamStatsInstantWins"]>) =>
  userStatisticsRepository.updateSamStatsInstantWins(...args);
