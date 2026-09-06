import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
// Изменение журнала
export class UpdateJournalDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsObject()
  appearance?: Record<string, unknown>;
}
