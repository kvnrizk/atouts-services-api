import { Type } from 'class-transformer';
import { IsIn, IsObject, IsOptional, IsString, Length, Matches, MaxLength, ValidateNested } from 'class-validator';

class CollectContextDto {
  @IsString() @MaxLength(300) path: string;
  @IsString() @MaxLength(100) source: string;
  @IsOptional() @IsString() @MaxLength(200) referrerHost?: string;
  @IsOptional() @IsString() @MaxLength(100) utmSource?: string;
  @IsOptional() @IsString() @MaxLength(100) utmMedium?: string;
  @IsOptional() @IsString() @MaxLength(150) utmCampaign?: string;
  @IsOptional() @IsString() @Length(2, 2) country?: string;
  @IsOptional() @IsString() @MaxLength(100) city?: string;
  @IsIn(['mobile', 'tablet', 'desktop']) device: string;
  @Matches(/^[0-9a-f]{16}$/) visitor: string;
}

/** Sent only by the Next.js /api/collect route (server-to-server, with ANALYTICS_INGEST_KEY). */
export class CollectDto {
  @IsIn(['pageview', 'event']) type: 'pageview' | 'event';

  @IsOptional() @IsIn(['phone_click', 'quote_step', 'quote_submitted']) name?: string;

  @IsOptional() @IsObject() props?: Record<string, string>;

  @ValidateNested() @Type(() => CollectContextDto) context: CollectContextDto;
}
