import { log } from "../lib/utils/logger";
import { supabase } from "../databases/supabase";
import { mapSafeUserData, mapUserData } from "../mappers/user.mapper";
import { User } from "../entities/user"
import { CreateUserRepoDTO } from "../dtos/user.dto"
import { SafeUser } from "../mappers/user.mapper"
import { IUserRepository } from "../interfaces/repositories/user-repository";
import { SupabaseClient } from "@supabase/supabase-js";

export class UserRepository implements IUserRepository {
  constructor(
    private readonly _db: SupabaseClient
  ) {}
  async createUser (user: CreateUserRepoDTO): Promise<SafeUser | null> {
    const { data, error } = await this._db
      .from("users")
      .insert([
        {
          email: user.email,
          full_name: user.fullName,
          password: user.hashedPassword,
          profile_pic: "", // default by empty profile pic <-> change later when updating profile
          balance: 1000, // default initial balance
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

  async findUserById(id: number): Promise<User | null> {
    const { data, error } = await this._db
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

  async findUserByEmail (email: string): Promise<User | null> {
    const { data, error } = await this._db
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      log("findUserByEmail error:", error, "error");
      return null;
    }

    return mapUserData(data);
  };

  async updateUserProfilePic (
    userId: number,
    profilePicUrl: string,
  ): Promise<SafeUser | null> {
    const { data, error } = await this._db
      .from("users")
      .update({ profile_pic: profilePicUrl })
      .eq("id", userId)
      .select()
      .single();

    if (error || !data) return null;

    return mapSafeUserData(data);
  };

  async getUserById (id: number): Promise<SafeUser | null> {
    const { data, error } = await this._db
      .from("users")
      .select("id, email, full_name, profile_pic, balance, created_at, updated_at")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return mapSafeUserData(data);
  };
}

export const userRepository = new UserRepository(supabase);

// Singleton export for auth.middleware
export const getUserById = (...args: Parameters<UserRepository["getUserById"]>) =>
  userRepository.getUserById(...args);

// Singleton export for socket-auth.middleware
export const findUserById = (...args: Parameters<UserRepository["findUserById"]>) =>
  userRepository.findUserById(...args);