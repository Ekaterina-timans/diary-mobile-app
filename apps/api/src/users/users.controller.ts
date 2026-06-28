import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UsersService } from './users.service';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: Request) {
    const payload = req.user as JwtPayload;
    return this.users.getProfile(payload.sub);
  }

  @Patch('profile')
  updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const payload = req.user as JwtPayload;
    return this.users.updateProfile(payload.sub, dto);
  }

  @Patch('profile/password')
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const payload = req.user as JwtPayload;
    return this.users.changePassword(payload.sub, dto);
  }

  @Delete('account')
  deleteAccount(@Req() req: Request, @Body() dto: DeleteAccountDto) {
    const payload = req.user as JwtPayload;
    return this.users.deleteAccount(payload.sub, dto);
  }
}
