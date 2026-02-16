import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Он подписывает токены (sign(payload)) и проверяет (verify(token))
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './types/jwt-payload';
import type { RefreshPayload } from './types/refresh-payload';
import type { SignOptions } from 'jsonwebtoken';
import { AuthResponse, AuthTokens } from './types/auth-response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private getAccessSecret() {
    return process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
  }

  private getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
  }

  private getAccessExpiresIn(): SignOptions['expiresIn'] {
    return (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']) ?? '30m';
  }

  private getRefreshExpiresIn(): SignOptions['expiresIn'] {
    return (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) ?? '30d';
  }

  private getPasswordSaltRounds() {
    return Number(process.env.PASSWORD_SALT_ROUNDS || 12);
  }

  private getRefreshSaltRounds() {
    return Number(process.env.REFRESH_TOKEN_SALT_ROUNDS || 12);
  }

  private async signAccessToken(payload: JwtPayload) {
    return this.jwt.signAsync(payload, {
      secret: this.getAccessSecret(),
      expiresIn: this.getAccessExpiresIn(),
    });
  }

  private async signRefreshToken(payload: RefreshPayload) {
    return this.jwt.signAsync(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.getRefreshExpiresIn(),
    });
  }

  private async issueTokens(
    userId: string,
    email: string,
    refreshTokenId: string,
  ): Promise<AuthTokens> {
    const accessToken = await this.signAccessToken({ sub: userId, email });
    const refreshToken = await this.signRefreshToken({ sub: userId, tokenId: refreshTokenId });
    return { accessToken, refreshToken };
  }

  async register(params: {
    email: string;
    password: string;
    displayName: string;
    deviceId?: string;
    userAgent?: string;
    ip?: string;
  }): Promise<AuthResponse> {
    const email = params.email.toLowerCase().trim();

    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ForbiddenException('Email already in use');

    const passwordHash = await bcrypt.hash(params.password, this.getPasswordSaltRounds());

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName: params.displayName,
        settings: {
          theme: 'dark',
          fontFamily: 'serif',
          fontSize: 'md',
          showMoodInCalendar: true,
          requireBiometric: false,
          autoLockSeconds: 60,
          hideInAppSwitcher: false,
          reduceMotion: false,
        },
      },
      select: { id: true, email: true, displayName: true },
    });

    // создаём refresh token запись (rotation начинается с первой выдачи)
    const refreshTokenRecord = await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: 'PENDING', // временно, сейчас заменим
        expiresAt: this.computeRefreshExpiresAt(),
        deviceId: params.deviceId,
        userAgent: params.userAgent,
        ip: params.ip,
      },
      select: { id: true },
    });

    const tokens = await this.issueTokens(user.id, user.email, refreshTokenRecord.id);

    // хэшируем и сохраняем refresh token (в БД никогда не хранить raw токен)
    const tokenHash = await bcrypt.hash(tokens.refreshToken, this.getRefreshSaltRounds());

    await this.prisma.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { tokenHash },
    });

    return {
      user,
      tokens,
    };
  }

  async login(params: {
    email: string;
    password: string;
    deviceId?: string;
    userAgent?: string;
    ip?: string;
  }): Promise<AuthResponse> {
    const email = params.email.toLowerCase().trim();

    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(params.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const refreshTokenRecord = await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: 'PENDING',
        expiresAt: this.computeRefreshExpiresAt(),
        deviceId: params.deviceId,
        userAgent: params.userAgent,
        ip: params.ip,
      },
      select: { id: true },
    });

    const tokens = await this.issueTokens(user.id, user.email, refreshTokenRecord.id);

    const tokenHash = await bcrypt.hash(tokens.refreshToken, this.getRefreshSaltRounds());

    await this.prisma.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { tokenHash },
    });

    return {
      user: { id: user.id, email: user.email, displayName: user.displayName },
      tokens,
    };
  }

  async refresh(params: {
    refreshToken: string;
    deviceId?: string;
    userAgent?: string;
    ip?: string;
  }): Promise<{ user: AuthResponse['user']; tokens: AuthTokens }> {
    let payload: RefreshPayload;

    try {
      payload = await this.jwt.verifyAsync<RefreshPayload>(params.refreshToken, {
        secret: this.getRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 1) находим запись refresh token, проверяем revoke/expiry
    const tokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        id: payload.tokenId,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.user.deletedAt)
      throw new UnauthorizedException('Invalid refresh token');

    // 2) сверяем хэш (защита от утечек БД)
    const hashOk = await bcrypt.compare(params.refreshToken, tokenRecord.tokenHash);
    if (!hashOk) throw new UnauthorizedException('Invalid refresh token');

    // 3) rotation: отзываем старый token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // 4) создаём новый token record
    const newRecord = await this.prisma.refreshToken.create({
      data: {
        userId: tokenRecord.userId,
        tokenHash: 'PENDING',
        expiresAt: this.computeRefreshExpiresAt(),
        deviceId: params.deviceId ?? tokenRecord.deviceId,
        userAgent: params.userAgent ?? tokenRecord.userAgent,
        ip: params.ip ?? tokenRecord.ip,
      },
      select: { id: true },
    });

    const tokens = await this.issueTokens(tokenRecord.userId, tokenRecord.user.email, newRecord.id);

    const newHash = await bcrypt.hash(tokens.refreshToken, this.getRefreshSaltRounds());

    await this.prisma.refreshToken.update({
      where: { id: newRecord.id },
      data: { tokenHash: newHash },
    });

    return {
      user: {
        id: tokenRecord.userId,
        email: tokenRecord.user.email,
        displayName: tokenRecord.user.displayName,
      },
      tokens,
    };
  }

  async logout(refreshToken: string) {
    let payload: RefreshPayload;

    try {
      payload = await this.jwt.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.getRefreshSecret(),
      });
    } catch {
      return { ok: true };
    }

    await this.prisma.refreshToken.updateMany({
      where: {
        id: payload.tokenId,
        userId: payload.sub,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return { ok: true };
  }

  private computeRefreshExpiresAt() {
    // упрощённо: 30 дней. В проде можно парсить JWT_REFRESH_EXPIRES_IN.
    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
}
