import { ArrayNotEmpty, ArrayUnique, IsArray, IsString } from 'class-validator';

export class ReorderJournalFoldersDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  folderIds!: string[];
}
