import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { JournalPagesService } from './journal-pages.service';
import type { Request } from 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload';
import { CreateJournalPageDto } from './dto/create-journal-page.dto';
import { UpdateJournalPageDto } from './dto/update-journal-page.dto';
import { SetPageBookmarkDto } from './dto/set-page-bookmark.dto';
import { JournalPageOrderService } from './journal-page-order.service';
import { ReorderJournalPagesDto } from './dto/reorder-journal-pages.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class JournalPagesController {
  constructor(
    private readonly pages: JournalPagesService,
    private readonly pageOrder: JournalPageOrderService,
  ) {}

  @Get('journals/:journalId/pages')
  getPages(@Req() req: Request, @Param('journalId') journalId: string) {
    const user = req.user as JwtPayload;

    return this.pages.getPages(user.sub, journalId);
  }

  @Post('journals/:journalId/pages')
  createPage(
    @Req() req: Request,
    @Param('journalId') journalId: string,
    @Body() dto: CreateJournalPageDto,
  ) {
    const user = req.user as JwtPayload;

    return this.pages.createPage(user.sub, journalId, dto);
  }

  @Get('journal-pages/:pageId')
  getPage(@Req() req: Request, @Param('pageId') pageId: string) {
    const user = req.user as JwtPayload;

    return this.pages.getPage(user.sub, pageId);
  }

  @Patch('journal-pages/:pageId/opened')
  markPageOpened(@Req() req: Request, @Param('pageId') pageId: string) {
    const user = req.user as JwtPayload;

    return this.pages.markPageOpened(user.sub, pageId);
  }

  @Patch('journal-pages/:pageId')
  updatePage(
    @Req() req: Request,
    @Param('pageId') pageId: string,
    @Body() dto: UpdateJournalPageDto,
  ) {
    const user = req.user as JwtPayload;

    return this.pages.updatePage(user.sub, pageId, dto);
  }

  @Patch('journal-pages/:pageId/bookmark')
  setBookmark(
    @Req() req: Request,
    @Param('pageId') pageId: string,
    @Body() dto: SetPageBookmarkDto,
  ) {
    const user = req.user as JwtPayload;

    return this.pages.setBookmark(user.sub, pageId, dto);
  }

  @Delete('journal-pages/:pageId')
  deletePage(@Req() req: Request, @Param('pageId') pageId: string) {
    const user = req.user as JwtPayload;

    return this.pageOrder.deletePage(user.sub, pageId);
  }

  @Patch('journals/:journalId/pages/reorder')
  reorderPages(
    @Req() req: Request,
    @Param('journalId') journalId: string,
    @Body() dto: ReorderJournalPagesDto,
  ) {
    const user = req.user as JwtPayload;

    return this.pageOrder.reorderPages(user.sub, journalId, dto);
  }
}
