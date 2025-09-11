import { UserStatisticsPhom, UserStatisticsSam } from "../entities/user-statistics";

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