import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
// автоматический уборщик удалённых аккаунтов
const ACCOUNT_RETENTION_DAYS = 30;

@Injectable()
export class AccountCleanupService {
  private readonly logger = new Logger(AccountCleanupService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM, {
    timeZone: 'UTC',
  })
  // Каждый день в 03:00 UTC запускается
  async deleteExpiredAccounts() {
    const deleteBefore = new Date();
    // вычисляет дату «сегодня минус 30 дней»
    deleteBefore.setUTCDate(deleteBefore.getUTCDate() - ACCOUNT_RETENTION_DAYS);
    // Находит пользователей, у которых deletedAt не пустой и старше этой даты
    try {
      const result = await this.prisma.user.deleteMany({
        where: {
          deletedAt: {
            not: null,
            lte: deleteBefore,
          },
        },
      });
      if (result.count > 0) {
        this.logger.log(`Permanently deleted ${result.count} expired account(s)`);
      }
    } catch (error) {
      this.logger.error(
        'Failed to permanently delete expired accounts',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
