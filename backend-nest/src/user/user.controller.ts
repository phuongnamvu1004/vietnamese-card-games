import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update-profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() body: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.id, body);
  }

  @Get('user-profile')
  @UseGuards(JwtAuthGuard)
  getUserData(@CurrentUser() user: AuthUser) {
    return this.userService.getUserData(user.id);
  }

  @Get('user-statistics')
  @UseGuards(JwtAuthGuard)
  getUserStatistics(@CurrentUser() user: AuthUser) {
    return this.userService.getUserStatistics(user.id);
  }
}
