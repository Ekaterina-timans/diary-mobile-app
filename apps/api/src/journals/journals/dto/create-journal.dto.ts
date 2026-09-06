import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
// Создание журнала
export class CreateJournalDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  folderId?: string | null;

  @IsOptional()
  @IsObject()
  appearance?: Record<string, unknown>;
}
