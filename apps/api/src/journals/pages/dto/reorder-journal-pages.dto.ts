import { ArrayNotEmpty, ArrayUnique, IsArray, IsString } from 'class-validator';

export class ReorderJournalPagesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  pageIds!: string[];
}
