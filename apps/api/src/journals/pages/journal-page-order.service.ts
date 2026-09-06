import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JournalPagesService } from './journal-pages.service';
import { ReorderJournalPagesDto } from './dto/reorder-journal-pages.dto';

@Injectable()
export class JournalPageOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pages: JournalPagesService,
  ) {}

  async deletePage(userId: string, pageId: string) {
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

    const journalId = page.journalId;

    await this.prisma.$transaction(async (tx) => {
      const activePages = await tx.journalPage.findMany({
        where: {
          userId,
          journalId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
        orderBy: {
          pageIndex: 'asc',
        },
      });

      if (activePages.length <= 1) {
        throw new BadRequestException('A journal must contain at least one page');
      }

      const indexInfo = await tx.journalPage.aggregate({
        where: {
          journalId,
        },
        _max: {
          pageIndex: true,
        },
      });

      const firstFreeIndex = (indexInfo._max.pageIndex ?? -1) + 1;

      await tx.journalPage.update({
        where: {
          id: page.id,
        },
        data: {
          deletedAt: new Date(),
          pageIndex: firstFreeIndex,
        },
      });

      const remainingPages = activePages.filter((activePage) => activePage.id !== page.id);
      const temporaryIndexStart = firstFreeIndex + remainingPages.length + 1;

      // Prevent transient collisions with the unique journalId/pageIndex pair.
      for (let index = 0; index < remainingPages.length; index += 1) {
        await tx.journalPage.update({
          where: {
            id: remainingPages[index].id,
          },
          data: {
            pageIndex: temporaryIndexStart + index,
          },
        });
      }

      for (let index = 0; index < remainingPages.length; index += 1) {
        await tx.journalPage.update({
          where: {
            id: remainingPages[index].id,
          },
          data: {
            pageIndex: index,
          },
        });
      }
    });

    return this.pages.getPages(userId, journalId);
  }

  async reorderPages(userId: string, journalId: string, dto: ReorderJournalPagesDto) {
    await this.pages.getPages(userId, journalId);

    const activePages = await this.prisma.journalPage.findMany({
      where: {
        userId,
        journalId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (activePages.length !== dto.pageIds.length) {
      throw new BadRequestException('Page list is incomplete');
    }

    const activePageIds = new Set(activePages.map((page) => page.id));

    const containsUnknownPage = dto.pageIds.some((pageId) => !activePageIds.has(pageId));

    if (containsUnknownPage) {
      throw new BadRequestException('Page list contains an unknown page');
    }

    await this.prisma.$transaction(async (tx) => {
      const indexInfo = await tx.journalPage.aggregate({
        where: {
          journalId,
        },
        _max: {
          pageIndex: true,
        },
      });

      // Сначала переносим страницы во временные свободные индексы.
      const temporaryIndexStart = (indexInfo._max.pageIndex ?? -1) + 1;

      for (let index = 0; index < dto.pageIds.length; index += 1) {
        await tx.journalPage.update({
          where: {
            id: dto.pageIds[index],
          },
          data: {
            pageIndex: temporaryIndexStart + index,
          },
        });
      }

      // Затем присваиваем окончательные индексы в переданном порядке.
      for (let index = 0; index < dto.pageIds.length; index += 1) {
        await tx.journalPage.update({
          where: {
            id: dto.pageIds[index],
          },
          data: {
            pageIndex: index,
          },
        });
      }
    });

    return this.pages.getPages(userId, journalId);
  }
}
