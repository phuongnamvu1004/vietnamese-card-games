// models/user.model.ts
import { supabase } from "../database/db";
import { log } from "../lib/utils";

export interface User {
  id: number;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

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

export const createUser = async (user: {
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
}): Promise<SafeUser | null> => {
  const {data, error} = await supabase
    .from("users")
    .insert([
      {
        email: user.email,
        full_name: user.fullName,
        password: user.password,
        profile_pic: user.profilePic || "",
        balance: 0,
      },
    ])
    .select()
    .single();

  if (error || !data) {
    log("createUser error:", error?.message, error?.details, "error");
    return null;
  }

  return mapSafeUserData(data);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const {data, error} = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    log("findUserByEmail error:", error, "error");
    return null;
  }

  return mapUserData(data);
};

export const updateUserProfilePic = async (
  userId: number,
  profilePicUrl: string,
): Promise<SafeUser | null> => {
  const {data, error} = await supabase
    .from("users")
    .update({profile_pic: profilePicUrl})
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) return null;

  return mapSafeUserData(data);
};

export const getUserById = async (id: number): Promise<SafeUser | null> => {
  const {data, error} = await supabase
    .from("users")
    .select("id, email, full_name, profile_pic, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return mapSafeUserData(data);
};
