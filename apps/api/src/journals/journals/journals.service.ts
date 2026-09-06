import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { Prisma } from '@prisma/client';
import { MoveJournalDto } from './dto/move-journal.dto';
import { ReorderJournalsDto } from './dto/reorder-journals.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';

@Injectable()
export class JournalsService {
  constructor(private readonly prisma: PrismaService) {}
  // Получает все активные журналы пользователя.
  async getJournals(userId: string) {
    return this.prisma.journal.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [
        {
          folderId: 'asc',
        },
        {
          sortOrder: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
      include: {
        folder: {
          select: {
            id: true,
            title: true,
            icon: true,
            color: true,
          },
        },
        _count: {
          select: {
            pages: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }
  // Получает один журнал.
  async getJournal(userId: string, journalId: string) {
    const journal = await this.prisma.journal.findFirst({
      where: {
        id: journalId,
        userId,
        deletedAt: null,
      },
      include: {
        folder: {
          select: {
            id: true,
            title: true,
            icon: true,
            color: true,
          },
        },
        pages: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            pageIndex: 'asc',
          },
          select: {
            id: true,
            pageIndex: true,
            bookmarkedAt: true,
            lastOpenedAt: true,
            revision: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }
    return journal;
  }
  // Создаёт новый журнал.
  async createJournal(userId: string, dto: CreateJournalDto) {
    const title = dto.title.trim();
    const folderId = dto.folderId ?? null;

    if (!title) {
      throw new BadRequestException('Journal title cannot be empty');
    }

    if (folderId) {
      const folder = await this.prisma.journalFolder.findFirst({
        where: {
          id: folderId,
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const positionResult = await tx.journal.aggregate({
        where: {
          userId,
          folderId,
          deletedAt: null,
        },
        _max: {
          sortOrder: true,
        },
      });

      const sortOrder = (positionResult._max.sortOrder ?? -1) + 1;

      const journal = await tx.journal.create({
        data: {
          userId,
          folderId,
          title,
          sortOrder,
          ...(dto.appearance
            ? {
                appearance: dto.appearance as Prisma.InputJsonValue,
              }
            : {}),
        },
      });

      await tx.journalPage.create({
        data: {
          userId,
          journalId: journal.id,
          pageIndex: 0,
        },
      });

      return tx.journal.findUniqueOrThrow({
        where: {
          id: journal.id,
        },
        include: {
          pages: {
            where: {
              deletedAt: null,
            },
            orderBy: {
              pageIndex: 'asc',
            },
          },
        },
      });
    });
  }
  // Изменяет журнал.
  async updateJournal(userId: string, journalId: string, dto: UpdateJournalDto) {
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

    let title: string | undefined;

    if (dto.title !== undefined) {
      title = dto.title.trim();

      if (!title) {
        throw new BadRequestException('Journal title cannot be empty');
      }
    }

    await this.prisma.journal.update({
      where: {
        id: journal.id,
      },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(dto.appearance !== undefined
          ? { appearance: dto.appearance as Prisma.InputJsonValue }
          : {}),
      },
    });

    return this.getJournal(userId, journal.id);
  }
  // Перемещает журнал
  async moveJournal(userId: string, journalId: string, dto: MoveJournalDto) {
    const journal = await this.prisma.journal.findFirst({
      where: {
        id: journalId,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
        folderId: true,
      },
    });

    if (!journal) {
      throw new NotFoundException('Journal not found');
    }

    const targetFolderId = dto.folderId;

    if (targetFolderId) {
      const folder = await this.prisma.journalFolder.findFirst({
        where: {
          id: targetFolderId,
          userId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }
    }

    if (journal.folderId === targetFolderId) {
      return this.getJournal(userId, journal.id);
    }

    await this.prisma.$transaction(async (tx) => {
      const positionResult = await tx.journal.aggregate({
        where: {
          userId,
          folderId: targetFolderId,
          deletedAt: null,
        },
        _max: {
          sortOrder: true,
        },
      });

      const sortOrder = (positionResult._max.sortOrder ?? -1) + 1;

      await tx.journal.update({
        where: {
          id: journal.id,
        },
        data: {
          folderId: targetFolderId,
          sortOrder,
        },
      });
    });

    return this.getJournal(userId, journal.id);
  }
  // Мягко удаляет журнал.
  async deleteJournal(userId: string, journalId: string) {
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

    const deletedAt = new Date();

    await this.prisma.$transaction([
      this.prisma.journal.update({
        where: {
          id: journal.id,
        },
        data: {
          deletedAt,
        },
      }),
      this.prisma.journalPage.updateMany({
        where: {
          journalId: journal.id,
          userId,
          deletedAt: null,
        },
        data: {
          deletedAt,
        },
      }),
    ]);

    return {
      ok: true,
    };
  }
  // Меняет порядок журналов внутри конкретной папки или раздела «Без папки»
  async reorderJournals(userId: string, dto: ReorderJournalsDto) {
    const journals = await this.prisma.journal.findMany({
      where: {
        userId,
        folderId: dto.folderId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (journals.length !== dto.journalIds.length) {
      throw new BadRequestException('Journal list is incomplete');
    }

    const existingIds = new Set(journals.map((journal) => journal.id));
    const containsUnknownJournal = dto.journalIds.some((journalId) => !existingIds.has(journalId));

    if (containsUnknownJournal) {
      throw new BadRequestException('Journal list contains an unknown journal');
    }

    await this.prisma.$transaction(
      dto.journalIds.map((journalId, sortOrder) =>
        this.prisma.journal.update({
          where: {
            id: journalId,
          },
          data: {
            sortOrder,
          },
        }),
      ),
    );

    return this.prisma.journal.findMany({
      where: {
        userId,
        folderId: dto.folderId,
        deletedAt: null,
      },
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
      include: {
        _count: {
          select: {
            pages: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }
}
