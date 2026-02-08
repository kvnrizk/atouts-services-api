import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePriceReferenceDto {
  @IsString()
  @MaxLength(50)
  category: string;

  @IsString()
  @MaxLength(100)
  workItem: string;

  @IsString()
  @MaxLength(200)
  label: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @IsNumber()
  @Min(0)
  priceLow: number;

  @IsNumber()
  @Min(0)
  priceMid: number;

  @IsNumber()
  @Min(0)
  priceHigh: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
