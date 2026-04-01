import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.jwt as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Unauthorized - No Token Provided');
    }

    let payload: { userId: string };
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'dev-jwt-secret',
      });
    } catch {
      throw new UnauthorizedException('Unauthorized - Invalid Token');
    }

    const user = await this.authService.findSafeUserById(Number(payload.userId));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    request.user = user;
    return true;
  }
}
