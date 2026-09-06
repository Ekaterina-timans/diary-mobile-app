import { IsBoolean } from 'class-validator';

export class SetPageBookmarkDto {
  @IsBoolean()
  bookmarked!: boolean;
}
