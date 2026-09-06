import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalFolderDto } from './dto/create-journal-folder.dto';
import { ReorderJournalFoldersDto } from './dto/reorder-journal-folders.dto';
import { UpdateJournalFolderDto } from './dto/update-journal-folder.dto';

@Injectable()
export class JournalFoldersService {
  // Получает доступ к Prisma и базе данных. Через this.prisma сервис читает, создаёт и изменяет записи.
  constructor(private readonly prisma: PrismaService) {}
  // Получает все неудалённые папки пользователя.
  async getFolders(userId: string) {
    return this.prisma.journalFolder.findMany({
      where: {
        userId,
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
            journals: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }
  // Создаёт новую папку.
  async createFolder(userId: string, dto: CreateJournalFolderDto) {
    const title = dto.title.trim();

    if (!title) {
      throw new BadRequestException('Folder title cannot be empty');
    }

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.journalFolder.aggregate({
        where: {
          userId,
          deletedAt: null,
        },
        _max: {
          sortOrder: true,
        },
      });

      const sortOrder = (result._max.sortOrder ?? -1) + 1;
      return tx.journalFolder.create({
        data: {
          userId,
          title,
          icon: dto.icon,
          color: dto.color,
          sortOrder,
        },
      });
    });
  }
  // Изменяет существующую папку.
  async updateFolder(userId: string, folderId: string, dto: UpdateJournalFolderDto) {
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

    let title: string | undefined;
    if (dto.title !== undefined) {
      title = dto.title.trim();

      if (!title) {
        throw new BadRequestException('Folder title cannot be empty');
      }
    }

    return this.prisma.journalFolder.update({
      where: {
        id: folder.id,
      },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(dto.icon !== undefined ? { icon: dto.icon } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
      },
    });
  }
  // Мягко удаляет папку, но сохраняет её журналы.
  async deleteFolder(userId: string, folderId: string) {
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

    await this.prisma.$transaction(async (tx) => {
      const journals = await tx.journal.findMany({
        where: {
          userId,
          folderId: folder.id,
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
        select: {
          id: true,
        },
      });

      const unfiledResult = await tx.journal.aggregate({
        where: {
          userId,
          folderId: null,
          deletedAt: null,
        },
        _max: {
          sortOrder: true,
        },
      });

      const firstFreePosition = (unfiledResult._max.sortOrder ?? -1) + 1;
      for (let index = 0; index < journals.length; index += 1) {
        await tx.journal.update({
          where: {
            id: journals[index].id,
          },
          data: {
            folderId: null,
            sortOrder: firstFreePosition + index,
          },
        });
      }

      await tx.journalFolder.update({
        where: {
          id: folder.id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    });

    return {
      ok: true,
    };
  }
  // Меняет порядок папок.
  async reorderFolders(userId: string, dto: ReorderJournalFoldersDto) {
    const folders = await this.prisma.journalFolder.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (folders.length !== dto.folderIds.length) {
      throw new BadRequestException('Folder list is incomplete');
    }

    const existingIds = new Set(folders.map((folder) => folder.id));
    const containsUnknownFolder = dto.folderIds.some((folderId) => !existingIds.has(folderId));

    if (containsUnknownFolder) {
      throw new BadRequestException('Folder list contains an unknown folder');
    }

    await this.prisma.$transaction(
      dto.folderIds.map((folderId, sortOrder) =>
        this.prisma.journalFolder.update({
          where: {
            id: folderId,
          },
          data: {
            sortOrder,
          },
        }),
      ),
    );

    return this.getFolders(userId);
  }
}
