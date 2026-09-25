import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsNumber()
  client_id: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  quote_request_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  deposit_percentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  estimated_start_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  estimated_end_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
