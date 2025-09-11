import { User } from "../entities/user";

export type SafeUser = Omit<User, "password">;

export const mapUserData = (data: Record<string, unknown>): User => ({
  id: Number(data.id),
  email: String(data.email),
  fullName: String(data.full_name),
  password: String(data.password),
  profilePic:
    typeof data.profile_pic === "string" ? data.profile_pic : undefined,
  balance: Number(data.balance),
  createdAt: String(data.created_at),
  updatedAt: String(data.updated_at),
});

export const mapSafeUserData = (data: Record<string, unknown>): SafeUser => ({
  id: Number(data.id),
  email: String(data.email),
  fullName: String(data.full_name),
  profilePic:
    typeof data.profile_pic === "string" ? data.profile_pic : undefined,
  balance: Number(data.balance),
  createdAt: String(data.created_at),
  updatedAt: String(data.updated_at),
});