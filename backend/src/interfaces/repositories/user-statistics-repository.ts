import { UserStatisticsPhom, UserStatisticsSam } from "../../entities/user-statistics";
import { InstantWinType } from "../../game/sam/rules/check-instant-win";

export interface IUserStatisticsRepository {
  initializeUserStatisticsSam(userId: number): Promise<void>;
  initializeUserStatisticsPhom(userId: number): Promise<void>;
  getUserStatisticsSamByUserId (userId: number): Promise<UserStatisticsSam | null>;
  getUserStatisticsPhomByUserId (userId: number): Promise<UserStatisticsPhom | null>;
  updateSamStatsWins(userId: number, winsInc: number, gamesInc: number): Promise<UserStatisticsSam | null>
  updateSamStatsInstantWins(userId: number, instantWins: Record<InstantWinType, number>): Promise<UserStatisticsSam | null>;
  updateUserStatisticsPhom (): Promise<void>; // TODO: define input and output
}