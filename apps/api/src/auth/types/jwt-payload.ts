export type JwtPayload = {
  sub: string; // идентификатор пользователя, для которого выпущен токен
  email: string;
};
