function envOrThrow(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function getJwtAccessSecret(): string {
  if (process.env.NODE_ENV === 'production') return envOrThrow('JWT_ACCESS_SECRET');
  return process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret';
}

export function getJwtRefreshSecret(): string {
  if (process.env.NODE_ENV === 'production') return envOrThrow('JWT_REFRESH_SECRET');
  return process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret';
}
