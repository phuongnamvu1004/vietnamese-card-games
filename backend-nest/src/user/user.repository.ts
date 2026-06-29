import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase';
import type { SafeUser } from './interfaces/safe-user.interface';
import type { User } from './interfaces/user.interface';
import { mapSafeUserData, mapUserData } from './mappers/user.mapper';

@Injectable()
export class UserRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createUser(input: {
    email: string;
    fullName: string;
    hashedPassword: string;
  }): Promise<SafeUser | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .insert([
        {
          email: input.email,
          full_name: input.fullName,
          password: input.hashedPassword,
          profile_pic: '',
          balance: 1000,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      throw new InternalServerErrorException(
        error?.message || 'Failed to create user',
      );
    }

    return mapSafeUserData(data as Record<string, unknown>);
  }

  async findUserById(id: number): Promise<User | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return null;
    }

    return mapUserData(data as Record<string, unknown>);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return null;
    }

    return mapUserData(data as Record<string, unknown>);
  }

  async updateUserProfilePic(
    userId: number,
    profilePicUrl: string,
  ): Promise<SafeUser | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .update({ profile_pic: profilePicUrl })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return null;
    }

    return mapSafeUserData(data as Record<string, unknown>);
  }

  async getUserById(id: number): Promise<SafeUser | null> {
    const { data, error } = await this.supabaseService.client
      .from('users')
      .select(
        'id, email, full_name, profile_pic, balance, created_at, updated_at',
      )
      .eq('id', id)
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      return null;
    }

    return mapSafeUserData(data as Record<string, unknown>);
  }
}
