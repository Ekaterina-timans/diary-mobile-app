import { Module } from '@nestjs/common';
import { JournalFoldersController } from './folders/journal-folders.controller';
import { JournalFoldersService } from './folders/journal-folders.service';
import { JournalsController } from './journals/journals.controller';
import { JournalsService } from './journals/journals.service';
import { JournalPagesController } from './pages/journal-pages.controller';
import { JournalPagesService } from './pages/journal-pages.service';
import { JournalPageOrderService } from './pages/journal-page-order.service';

@Module({
  controllers: [JournalFoldersController, JournalsController, JournalPagesController],
  providers: [
    JournalFoldersService,
    JournalsService,
    JournalPagesService,
    JournalPageOrderService,
  ],
  exports: [
    JournalFoldersService,
    JournalsService,
    JournalPagesService,
    JournalPageOrderService,
  ],
})
export class JournalsModule {}
