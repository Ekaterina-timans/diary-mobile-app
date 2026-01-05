import { AuthGuard } from '@nestjs/passport';

// класс-алиас
export class JwtAuthGuard extends AuthGuard('jwt') {}
