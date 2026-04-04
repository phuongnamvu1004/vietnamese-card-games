import {
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../../database/supabase';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { mapSafeUserData } from '../../user/mappers/user.mapper';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.jwt as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Unauthorized - No Token Provided');
    }

    let payload: { userId: string };
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Unauthorized - Invalid Token');
    }

    const { data, error } = await this.supabaseService.client
      .from('users')
      .select(
        'id, email, full_name, profile_pic, balance, created_at, updated_at',
      )
      .eq('id', Number(payload.userId))
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    const safeUser = data
      ? mapSafeUserData(data as Record<string, unknown>)
      : null;
    if (!safeUser) {
      throw new NotFoundException('User not found');
    }

    request.user = {
      id: safeUser.id,
      fullName: safeUser.fullName,
      email: safeUser.email,
      profilePic: safeUser.profilePic ?? '',
      balance: safeUser.balance,
    };
    return true;
  }
}
