import { IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCheckoutDto {
  @ApiProperty()
  @IsNumber()
  project_id: number;

  @ApiProperty({ enum: ['deposit', 'final'] })
  @IsString()
  payment_type: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;
}
