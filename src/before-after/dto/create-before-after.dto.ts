import { IsString, IsOptional, IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBeforeAfterDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  beforeImageUrl: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  afterImageUrl: string;

  @IsString()
  @MaxLength(50)
  category: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
