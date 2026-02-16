import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'; // ExtractJwt — утилита для извлечения токена из request
import { JwtPayload } from './types/jwt-payload';
import { getJwtAccessSecret } from 'src/shared/config/jwt-secrets';

// Определяет как именно проверять JWT токены
// Он нужен для Passport, чтобы Passport знал: откуда брать токен, чем его проверять и что возвращать как req.user
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // токен брать из заголовка
      ignoreExpiration: false, // токены с истёкшим exp считаются невалидными
      secretOrKey: getJwtAccessSecret(),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
