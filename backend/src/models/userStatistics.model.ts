import {supabase} from "../database/db";
import {log} from "../lib/utils";

export interface UserStatisticsSam {
  id: number;
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
  id: number;
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
  id: data.id,
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
  id: data.id,
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
  const { data, error } = await supabase
    .from("user_statistics_sam")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    log("getUserStatisticsSamByUserId:", error?.message, error?.details, "error");
    return null;
  }

  return mapUserStatisticsSam(data);
}

export const getUserStatisticsPhomByUserId = async (userId: number) => {
  const { data, error } = await supabase
    .from("user_statistics_phom")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    log("getUserStatisticsPhomByUserId:", error?.message, error?.details, "error");
    return null;
  }

  return mapUserStatisticsPhom(data);
}

export const updateUserStatisticsSam = async () => {
  // Todo
}

export const updateUserStatisticsPhom = async () => {
  // Todo
}

