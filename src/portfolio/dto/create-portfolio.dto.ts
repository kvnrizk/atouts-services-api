import { IsString, IsOptional, IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePortfolioDto {
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
  imageUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
