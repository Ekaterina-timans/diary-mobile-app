import { IsString, ValidateIf } from 'class-validator';
// Перемещение журнала
export class MoveJournalDto {
  @ValidateIf((_object, value) => value !== null)
  @IsString()
  folderId!: string | null;
}
