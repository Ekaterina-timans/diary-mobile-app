import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // предоставляет JwtService (который подписывает токены и проверяет их)
import { PassportModule } from '@nestjs/passport'; // библиотека для аутентификации
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import type { SignOptions } from 'jsonwebtoken';

// класс-модуль, в нём описаны зависимости, контроллеры и провайдеры
@Module({
  imports: [
    PassportModule,
    // возвращает “сконфигурированный модуль”
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret',
      signOptions: {
        expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']) ?? '30m',
      }, // access token будет жить 30 минут
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
