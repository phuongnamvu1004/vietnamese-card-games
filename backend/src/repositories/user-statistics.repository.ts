import { log } from "../lib/utils/logger";
import { mapUserStatisticsPhom, mapUserStatisticsSam } from "../mappers/user-statistics.mapper";
import { SupabaseClient } from "@supabase/supabase-js";
import { IUserStatisticsRepository } from "../interfaces/repositories/user-statistics-repository";

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
    }

    log("initializeUserStatisticsSam:", data, "info");
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
    }

    log("initializeUserStatisticsPhom:", data, "info");
  };

  async updateUserStatisticsSam () {
    // TODO
  };

  async updateUserStatisticsPhom () {
    // TODO
  };
}
