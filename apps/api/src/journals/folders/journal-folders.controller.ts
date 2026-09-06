import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { JournalFoldersService } from './journal-folders.service';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { CreateJournalFolderDto } from './dto/create-journal-folder.dto';
import { ReorderJournalFoldersDto } from './dto/reorder-journal-folders.dto';
import { UpdateJournalFolderDto } from './dto/update-journal-folder.dto';

@UseGuards(JwtAuthGuard)
@Controller('journal-folders')
export class JournalFoldersController {
  constructor(private readonly journals: JournalFoldersService) {}
  // возвращает папки пользователя
  @Get()
  getFolders(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.journals.getFolders(user.sub);
  }
  // создаёт папку
  @Post()
  createFolder(@Req() req: Request, @Body() dto: CreateJournalFolderDto) {
    const user = req.user as JwtPayload;
    return this.journals.createFolder(user.sub, dto);
  }
  // сохраняет новый порядок папок
  @Patch('reorder')
  reorderFolders(@Req() req: Request, @Body() dto: ReorderJournalFoldersDto) {
    const user = req.user as JwtPayload;
    return this.journals.reorderFolders(user.sub, dto);
  }
  // изменяет название, иконку или цвет
  @Patch(':id')
  updateFolder(
    @Req() req: Request,
    @Param('id') folderId: string,
    @Body() dto: UpdateJournalFolderDto,
  ) {
    const user = req.user as JwtPayload;
    return this.journals.updateFolder(user.sub, folderId, dto);
  }
  // удаляет папку и переносит журналы в «Без папки»
  @Delete(':id')
  deleteFolder(@Req() req: Request, @Param('id') folderId: string) {
    const user = req.user as JwtPayload;
    return this.journals.deleteFolder(user.sub, folderId);
  }
}
