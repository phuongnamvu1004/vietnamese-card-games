import { UserStatisticsPhom, UserStatisticsSam } from "../../entities/user-statistics";

export interface IUserStatisticsRepository {
  initializeUserStatisticsSam(userId: number): Promise<void>;
  initializeUserStatisticsPhom(userId: number): Promise<void>;
  getUserStatisticsSamByUserId (userId: number): Promise<UserStatisticsSam | null>;
  getUserStatisticsPhomByUserId (userId: number): Promise<UserStatisticsPhom | null>;
  updateUserStatisticsSam (): Promise<void>; // TODO: define input and output
  updateUserStatisticsPhom (): Promise<void>; // TODO: define input and output
}