import {
  ConflictException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalPageDto } from './dto/create-journal-page.dto';
import { Prisma } from '@prisma/client';
import { UpdateJournalPageDto } from './dto/update-journal-page.dto';
import { SetPageBookmarkDto } from './dto/set-page-bookmark.dto';

const MAX_PAGES_PER_JOURNAL = 500;
const MAX_PAGE_JSON_BYTES = 1_000_000;

@Injectable()
export class JournalPagesService {
  constructor(private readonly prisma: PrismaService) {}
  // Превращает JSON страницы в строку, считает размер в байтах и запрещает содержимое больше 1 МБ
  private validateContentSize(contentJson?: Record<string, unknown>) {
    if (!contentJson) {
      return;
    }

    const size = Buffer.byteLength(JSON.stringify(contentJson), 'utf8');

    if (size > MAX_PAGE_JSON_BYTES) {
      throw new PayloadTooLargeException('Page content is too large');
    }
  }
  // Проверяет существует ли журнал, принадлежит ли пользователю и не удалён ли он
  private async ensureJournalExists(userId: string, journalId: string) {
    const journal = await this.prisma.journal.findFirst({
      where: {
        id: journalId,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    return journal;
  }
  // Получает краткий список страниц журнала.
  async getPages(userId: string, journalId: string) {
    await this.ensureJournalExists(userId, journalId);

    return this.prisma.journalPage.findMany({
      where: {
        userId,
        journalId,
        deletedAt: null,
      },
      orderBy: {
        pageIndex: 'asc',
      },
      select: {
        id: true,
        pageIndex: true,
        contentPlain: true,
        bookmarkedAt: true,
        revision: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  // Получает одну полную страницу.
  async getPage(userId: string, pageId: string) {
    const page = await this.prisma.journalPage.findFirst({
      where: {
        id: pageId,
        userId,
        deletedAt: null,
        journal: {
          deletedAt: null,
        },
      },
      include: {
        attachments: true,
        journal: {
          select: {
            id: true,
            title: true,
            appearance: true,
          },
        },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return page;
  }
  async markPageOpened(userId: string, pageId: string) {
    const page = await this.prisma.journalPage.findFirst({
      where: {
        id: pageId,
        userId,
        deletedAt: null,
        journal: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
        journalId: true,
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const openedAt = new Date();

    await this.prisma.$transaction([
      this.prisma.journalPage.update({
        where: {
          id: page.id,
        },
        data: {
          lastOpenedAt: openedAt,
        },
      }),
      this.prisma.journal.update({
        where: {
          id: page.journalId,
        },
        data: {
          lastOpenedAt: openedAt,
        },
      }),
    ]);

    return this.getPage(userId, page.id);
  }
  // Создаёт следующую страницу журнала.
  async createPage(userId: string, journalId: string, dto: CreateJournalPageDto) {
    this.validateContentSize(dto.contentJson);

    await this.ensureJournalExists(userId, journalId);

    return this.prisma.$transaction(async (tx) => {
      const pageInfo = await tx.journalPage.aggregate({
        where: {
          userId,
          journalId,
          deletedAt: null,
        },
        _count: {
          id: true,
        },
        _max: {
          pageIndex: true,
        },
      });

      if (pageInfo._count.id >= MAX_PAGES_PER_JOURNAL) {
        throw new PayloadTooLargeException(
          `A journal cannot contain more than ${MAX_PAGES_PER_JOURNAL} pages`,
        );
      }

      const pageIndex = (pageInfo._max.pageIndex ?? -1) + 1;

      return tx.journalPage.create({
        data: {
          userId,
          journalId,
          pageIndex,
          contentPlain: dto.contentPlain ?? null,
          ...(dto.contentJson
            ? {
                contentJson: dto.contentJson as Prisma.InputJsonValue,
              }
            : {}),
        },
      });
    });
  }

  async updatePage(userId: string, pageId: string, dto: UpdateJournalPageDto) {
    this.validateContentSize(dto.contentJson);

    const page = await this.prisma.journalPage.findFirst({
      where: {
        id: pageId,
        userId,
        deletedAt: null,
        journal: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
        revision: true,
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    if (page.revision !== dto.expectedRevision) {
      throw new ConflictException({
        message: 'Page was changed by another request',
        currentRevision: page.revision,
      });
    }

    const result = await this.prisma.journalPage.updateMany({
      where: {
        id: page.id,
        userId,
        revision: dto.expectedRevision,
        deletedAt: null,
      },
      data: {
        contentJson: dto.contentJson as Prisma.InputJsonValue,
        contentPlain: dto.contentPlain,
        revision: {
          increment: 1,
        },
      },
    });

    if (result.count === 0) {
      throw new ConflictException('Page was changed while saving');
    }

    return this.getPage(userId, page.id);
  }

  async setBookmark(userId: string, pageId: string, dto: SetPageBookmarkDto) {
    const page = await this.prisma.journalPage.findFirst({
      where: {
        id: pageId,
        userId,
        deletedAt: null,
        journal: {
          deletedAt: null,
        },
      },
      select: {
        id: true,
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found');
    }

    return this.prisma.journalPage.update({
      where: {
        id: page.id,
      },
      data: {
        bookmarkedAt: dto.bookmarked ? new Date() : null,
      },
    });
  }
}
