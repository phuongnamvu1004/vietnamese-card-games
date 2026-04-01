import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import type { AuthUser } from './interfaces/auth-user.interface';
import { UserRepository } from '../user/user.repository';
import { UserStatisticsRepository } from '../user/user-statistics.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly userStatisticsRepository: UserStatisticsRepository,
  ) {}

  async signup(input: SignupDto): Promise<{ user: AuthUser; token: string }> {
    const { fullName, email, password } = input;

    if (!fullName || !email || !password) {
      throw new BadRequestException('All fields are required');
    }

    if (password.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters',
      );
    }

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await this.createUser({
      fullName,
      email,
      hashedPassword,
    });

    await this.initializeUserStatistics(createdUser.id);

    return {
      user: createdUser,
      token: this.generateToken(createdUser.id),
    };
  }

  async login(input: LoginDto): Promise<{ user: AuthUser; token: string }> {
    const { email, password } = input;

    const user = await this.findUserWithPasswordByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _password, ...safeUser } = user;

    return {
      user: safeUser,
      token: this.generateToken(user.id),
    };
  }

  logout(): { message: string } {
    return { message: 'Logged out successfully' };
  }

  async findSafeUserById(id: number): Promise<AuthUser | null> {
    return this.getSafeUserById(id);
  }

  refresh(token: string): { accessToken: string } {
    if (!token) {
      throw new UnauthorizedException('No token cookie');
    }

    return { accessToken: token };
  }

  private generateToken(userId: number): string {
    return this.jwtService.sign({ userId: String(userId) });
  }

  private async findUserByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const { password: _password, ...safeUser } = user;
    return {
      id: safeUser.id,
      fullName: safeUser.fullName,
      email: safeUser.email,
      profilePic: safeUser.profilePic ?? '',
      balance: safeUser.balance,
    };
  }

  private async findUserWithPasswordByEmail(
    email: string,
  ): Promise<(AuthUser & { password: string }) | null> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic ?? '',
      balance: user.balance,
      password: user.password,
    };
  }

  private async createUser(input: {
    fullName: string;
    email: string;
    hashedPassword: string;
  }): Promise<AuthUser> {
    const user = await this.userRepository.createUser(input);
    if (!user) {
      throw new InternalServerErrorException('Invalid user data');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic ?? '',
      balance: user.balance,
    };
  }

  private async getSafeUserById(id: number): Promise<AuthUser | null> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic ?? '',
      balance: user.balance,
    };
  }

  private async initializeUserStatistics(userId: number): Promise<void> {
    await this.userStatisticsRepository.initializeUserStatisticsSam(userId);
    await this.userStatisticsRepository.initializeUserStatisticsPhom(userId);
  }
}
