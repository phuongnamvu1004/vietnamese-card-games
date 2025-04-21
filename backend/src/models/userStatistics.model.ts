import { supabase } from "../database/db";
import { log } from "../lib/utils";

export interface UserStatisticsSam {
  userId: number;
  totalGames: number;
  totalWins: number;
  instantWins: {
    dragonStraight: number;
    fourTwos: number;
    flushHand: number;
    threeTriplets: number;
    fivePairs: number;
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
    regular: number; // ù thường
    allCard: number; // ù tròn
    allOdds: number; // ù khan
  };
  winRate: number;
  createdAt: string;
  updatedAt: string;
}

export const mapUserStatisticsSam = (
  data: Record<string, unknown>,
): UserStatisticsSam => ({
  userId: Number(data.user_id),
  totalGames: Number(data.total_games),
  totalWins: Number(data.total_wins),
  instantWins: {
    dragonStraight: Number(
      (data.instant_wins as Record<string, unknown>)?.dragonStraight ?? 0,
    ),
    fourTwos: Number(
      (data.instant_wins as Record<string, unknown>)?.fourTwos ?? 0,
    ),
    flushHand: Number(
      (data.instant_wins as Record<string, unknown>)?.flushHand ?? 0,
    ),
    threeTriplets: Number(
      (data.instant_wins as Record<string, unknown>)?.threeTriplets ?? 0,
    ),
    fivePairs: Number(
      (data.instant_wins as Record<string, unknown>)?.fivePairs ?? 0,
    ),
  },
  winRate: Number(data.win_rate),
  createdAt: String(data.created_at),
  updatedAt: String(data.updated_at),
});

export const mapUserStatisticsPhom = (
  data: Record<string, unknown>,
): UserStatisticsPhom => ({
  userId: Number(data.user_id),
  totalGames: Number(data.total_games),
  totalWins: Number(data.total_wins),
  instantWins: {
    regular: Number(
      (data.instant_wins as Record<string, unknown>)?.regular ?? 0,
    ),
    allCard: Number(
      (data.instant_wins as Record<string, unknown>)?.allCard ?? 0,
    ),
    allOdds: Number(
      (data.instant_wins as Record<string, unknown>)?.allOdds ?? 0,
    ),
  },
  winRate: Number(data.win_rate),
  createdAt: String(data.created_at),
  updatedAt: String(data.updated_at),
});

export const getUserStatisticsSamByUserId = async (userId: number) => {
  const { data, error } = await supabase
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

export const getUserStatisticsPhomByUserId = async (userId: number) => {
  const { data, error } = await supabase
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

export const initializeUserStatisticsSam = async (userId: number) => {
  const { data, error } = await supabase
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

export const initializeUserStatisticsPhom = async (userId: number) => {
  const { data, error } = await supabase
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

export const updateUserStatisticsSam = async () => {
  // Todo
};

export const updateUserStatisticsPhom = async () => {
  // Todo
};
