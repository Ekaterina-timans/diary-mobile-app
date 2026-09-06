import { IsInt, IsObject, IsString, MaxLength, Min } from 'class-validator';

export class UpdateJournalPageDto {
  @IsObject()
  contentJson!: Record<string, unknown>;

  @IsString()
  @MaxLength(500_000)
  contentPlain!: string;

  @IsInt()
  @Min(1)
  expectedRevision!: number;
}
