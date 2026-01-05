import { Body, Controller, Get, Ip, Post, Req, UseGuards } from '@nestjs/common'; // UseGuards — декоратор, который подключает Guard (проверку доступа)
import type { Request } from 'express';
import { JwtAuthGuard } from './jwt.guard'; // Проверяет наличие токена + его валидность
import { JwtPayload } from './types/jwt-payload';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller()
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('auth/register')
  register(@Body() dto: RegisterDto, @Req() req: Request, @Ip() ip: string) {
    return this.auth.register({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName,
      deviceId: req.headers['x-device-id']?.toString(),
      userAgent: req.headers['user-agent'],
      ip,
    });
  }

  @Post('auth/login')
  login(@Body() dto: LoginDto, @Req() req: Request, @Ip() ip: string) {
    return this.auth.login({
      email: dto.email,
      password: dto.password,
      deviceId: req.headers['x-device-id']?.toString(),
      userAgent: req.headers['user-agent'],
      ip,
    });
  }

  @Post('auth/refresh')
  refresh(@Body() dto: RefreshDto, @Req() req: Request, @Ip() ip: string) {
    return this.auth.refresh({
      refreshToken: dto.refreshToken,
      deviceId: dto.deviceId ?? req.headers['x-device-id']?.toString(),
      userAgent: req.headers['user-agent'],
      ip,
    });
  }

  @Post('auth/logout')
  logout(@Body() dto: RefreshDto) {
    return this.auth.logout(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    return { user: req.user as JwtPayload };
  }
}
