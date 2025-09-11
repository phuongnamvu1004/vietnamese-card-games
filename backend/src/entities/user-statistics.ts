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