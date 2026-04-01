import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import type { SafeUser } from './interfaces/safe-user.interface';
import type {
  UserStatisticsPhom,
  UserStatisticsSam,
} from './interfaces/user-statistics.interface';
import { UserRepository } from './user.repository';
import { UserStatisticsRepository } from './user-statistics.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userStatisticsRepository: UserStatisticsRepository,
  ) {}

  async updateProfile(
    userId: number,
    input: UpdateProfileDto,
  ): Promise<{ user: SafeUser; message: string }> {
    const { profilePic } = input;

    if (!profilePic) {
      throw new BadRequestException('Profile pic is required');
    }

    const updatedUser = await this.userRepository.updateUserProfilePic(
      userId,
      profilePic,
    );

    if (!updatedUser) {
      throw new InternalServerErrorException('Failed to update user profile');
    }

    return {
      user: updatedUser,
      message: 'Profile updated successfully',
    };
  }

  async getUserData(userId: number): Promise<SafeUser> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new InternalServerErrorException('Failed to retrieve user profile');
    }

    return user;
  }

  async getUserStatistics(userId: number): Promise<{
    stats: {
      samData: UserStatisticsSam;
      phomData: UserStatisticsPhom;
    };
    message: string;
  }> {
    const samData =
      await this.userStatisticsRepository.getUserStatisticsSamByUserId(userId);
    const phomData =
      await this.userStatisticsRepository.getUserStatisticsPhomByUserId(userId);

    if (!samData || !phomData) {
      throw new InternalServerErrorException(
        'Failed to retrieve user statistics',
      );
    }

    return {
      stats: { samData, phomData },
      message: 'User statistics retrieved successfully',
    };
  }
}
