import { supabase } from "../databases/supabase";
import { log } from "../lib/utils/logger";
import { mapSafeUserData, mapUserData } from "../mappers/user.mapper";
import { User } from "../entities/user"
import { CreateUserRepoDTO } from "../dtos/user.dto"
import { SafeUser } from "../mappers/user.mapper"

export const createUser = async (user: CreateUserRepoDTO): Promise<SafeUser | null> => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email: user.email,
        full_name: user.fullName,
        password: user.hashedPassword,
        profile_pic: "", // default by empty profile pic <-> change later when updating profile
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

export const findUserById = async (id: number): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    log("findUserById error:", error, "error");
    return null;
  }

  return mapUserData(data);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

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
  const { data, error } = await supabase
    .from("users")
    .update({ profile_pic: profilePicUrl })
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) return null;

  return mapSafeUserData(data);
};

export const getUserById = async (id: number): Promise<SafeUser | null> => {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, profile_pic, balance, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return mapSafeUserData(data);
};