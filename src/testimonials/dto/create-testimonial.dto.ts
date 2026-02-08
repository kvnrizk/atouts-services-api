import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsInt, Min, Max, MaxLength } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clientName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  clientCity?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  comment: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  projectType?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
