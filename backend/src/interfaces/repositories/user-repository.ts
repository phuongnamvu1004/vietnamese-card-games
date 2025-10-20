import { SafeUser } from "../../mappers/user.mapper";
import { User } from "../../entities/user";

export interface IUserRepository {
  createUser(input: { fullName: string; email: string; hashedPassword: string }): Promise<SafeUser | null>;
  findUserById(id: number): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  updateUserProfilePic(userId: number, profilePicUrl: string): Promise<SafeUser | null>;
  getUserById (id: number): Promise<SafeUser | null>;
}