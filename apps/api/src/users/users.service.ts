import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        displayName: true,
        settings: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: Prisma.UserUpdateInput = {};

    if (dto.displayName !== undefined) {
      data.displayName = dto.displayName;
    }

    if (dto.email !== undefined) {
      const email = dto.email.toLowerCase().trim();

      const exists = await this.prisma.user.findUnique({
        where: { email },
      });

      if (exists && exists.id !== userId) {
        throw new ForbiddenException('Email already in use');
      }

      data.email = email;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        displayName: true,
        settings: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) throw new NotFoundException('User not found');

    const passwordOk = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!passwordOk) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const saltRounds = Number(process.env.PASSWORD_SALT_ROUNDS || 12);

    const newHash = await bcrypt.hash(dto.newPassword, saltRounds);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      }),

      this.prisma.refreshToken.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { ok: true };
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordOk) {
      throw new UnauthorizedException('Password is incorrect');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { ok: true };
  }
}
