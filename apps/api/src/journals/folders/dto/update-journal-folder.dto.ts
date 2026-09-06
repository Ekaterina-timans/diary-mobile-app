import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateJournalFolderDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  icon?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid HEX color' })
  color?: string;
}
