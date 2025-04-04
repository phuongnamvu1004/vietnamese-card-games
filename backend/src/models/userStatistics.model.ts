import { supabase } from "../database/db";
import { log } from "../lib/utils";

export interface UserStatisticsSam {
  userId: number;
  totalGames: number;
  totalWins: number;
  instantWins: {
    dragonStraight: number,
    fourTwos: number,
    flushHand: number,
    threeTriplets: number,
    fivePairs: number
  };
  winRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserStatisticsPhom {
  userId: number;
  totalGames: number;
  totalWins: number;
  instantWins: {
    regular: number, // ù thường
    allCard: number, // ù tròn
    allOdds: number, // ù khan
  };
  winRate: number;
  createdAt: string;
  updatedAt: string;
}

export const mapUserStatisticsSam = (data: any): UserStatisticsSam => ({
  userId: data.user_id,
  totalGames: data.total_games,
  totalWins: data.total_wins,
  instantWins: {
    dragonStraight: data.instant_wins?.dragonStraight ?? 0,
    fourTwos: data.instant_wins?.fourTwos ?? 0,
    flushHand: data.instant_wins?.flushHand ?? 0,
    threeTriplets: data.instant_wins?.threeTriplets ?? 0,
    fivePairs: data.instant_wins?.fivePairs ?? 0,
  },
  winRate: data.win_rate,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const mapUserStatisticsPhom = (data: any): UserStatisticsPhom => ({
  userId: data.user_id,
  totalGames: data.total_games,
  totalWins: data.total_wins,
  instantWins: {
    regular: data.instant_wins?.regular ?? 0,
    allCard: data.instant_wins?.allCard ?? 0,
    allOdds: data.instant_wins?.allOdds ?? 0,
  },
  winRate: data.win_rate,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
});

export const getUserStatisticsSamByUserId = async (userId: number) => {
  const {data, error} = await supabase
    .from("user_statistics_sam")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    log("getUserStatisticsSamByUserId:", error?.message, error?.details, "error");
    return null;
  }

  log("getUserStatisticsSamByUserId:", mapUserStatisticsSam(data), "info");

  return mapUserStatisticsSam(data);
}

export const getUserStatisticsPhomByUserId = async (userId: number) => {
  const {data, error} = await supabase
    .from("user_statistics_phom")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    log("getUserStatisticsPhomByUserId:", error?.message, error?.details, "error");
    return null;
  }

  log("getUserStatisticsPhomByUserId:", mapUserStatisticsPhom(data), "info");

  return mapUserStatisticsPhom(data);
}

export const initializeUserStatisticsSam = async (userId: number) => {
  const {data, error} = await supabase
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
      }
    ])
    .select()
    .single();

  if (error || !data) {
    log("initializeUserStatisticsSam error:", error?.message, error?.details, "error");
  }

  log("initializeUserStatisticsSam:", data, "info");
}

export const initializeUserStatisticsPhom = async (userId: number) => {
  const {data, error} = await supabase
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
      }
    ])
    .select()
    .single();

  if (error || !data) {
    log("initializeUserStatisticsPhom error:", error?.message, error?.details, "error");
  }

  log("initializeUserStatisticsPhom:", data, "info");
}

export const updateUserStatisticsSam = async () => {
  // Todo
}

export const updateUserStatisticsPhom = async () => {
  // Todo
}

