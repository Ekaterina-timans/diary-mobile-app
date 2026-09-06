import { ArrayNotEmpty, ArrayUnique, IsArray, IsString, ValidateIf } from 'class-validator';
// Перестановка журналов
export class ReorderJournalsDto {
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  folderId!: string | null;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  journalIds!: string[];
}
