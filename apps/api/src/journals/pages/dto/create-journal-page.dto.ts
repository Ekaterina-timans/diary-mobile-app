import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateJournalPageDto {
  @IsOptional()
  @IsObject()
  contentJson?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(500_000)
  contentPlain?: string;
}
