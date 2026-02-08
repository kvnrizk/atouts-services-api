import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsInt,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SelectedItemDto {
  @IsString()
  workItem: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CalculateEstimationDto {
  @IsString()
  @MaxLength(50)
  category: string;

  @IsNumber()
  @Min(1)
  surfaceArea: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  rooms?: number;

  @IsString()
  qualityLevel: string; // eco, standard, premium

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedItemDto)
  selectedItems: SelectedItemDto[];

  @IsOptional()
  @IsString()
  utmSource?: string;

  @IsOptional()
  @IsString()
  utmMedium?: string;

  @IsOptional()
  @IsString()
  utmCampaign?: string;
}
