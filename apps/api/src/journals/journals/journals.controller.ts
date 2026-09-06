import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { JournalsService } from './journals.service';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { CreateJournalDto } from './dto/create-journal.dto';
import { ReorderJournalsDto } from './dto/reorder-journals.dto';
import { MoveJournalDto } from './dto/move-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('journals')
export class JournalsController {
  constructor(private readonly journals: JournalsService) {}
  // возвращает все журналы пользователя
  @Get()
  getJournals(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.journals.getJournals(user.sub);
  }
  // возвращает один журнал со страницами
  @Get(':id')
  getJournal(@Req() req: Request, @Param('id') journalId: string) {
    const user = req.user as JwtPayload;
    return this.journals.getJournal(user.sub, journalId);
  }
  // создаёт журнал и первую страницу
  @Post()
  createJournal(@Req() req: Request, @Body() dto: CreateJournalDto) {
    const user = req.user as JwtPayload;
    return this.journals.createJournal(user.sub, dto);
  }
  // меняет порядок журналов
  @Patch('reorder')
  reorderJournals(@Req() req: Request, @Body() dto: ReorderJournalsDto) {
    const user = req.user as JwtPayload;
    return this.journals.reorderJournals(user.sub, dto);
  }
  // переносит журнал в другую папку или «Без папки»
  @Patch(':id/move')
  moveJournal(@Req() req: Request, @Param('id') journalId: string, @Body() dto: MoveJournalDto) {
    const user = req.user as JwtPayload;

    return this.journals.moveJournal(user.sub, journalId, dto);
  }
  // меняет название и оформление
  @Patch(':id')
  updateJournal(
    @Req() req: Request,
    @Param('id') journalId: string,
    @Body() dto: UpdateJournalDto,
  ) {
    const user = req.user as JwtPayload;

    return this.journals.updateJournal(user.sub, journalId, dto);
  }
  // мягко удаляет журнал и страницы
  @Delete(':id')
  deleteJournal(@Req() req: Request, @Param('id') journalId: string) {
    const user = req.user as JwtPayload;

    return this.journals.deleteJournal(user.sub, journalId);
  }
}
