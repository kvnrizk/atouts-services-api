import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength } from 'class-validator';

export class SetSiteImageDto {
  @ApiProperty({ example: '/uploads/1727350000-photo.jpg' })
  @IsString()
  @MaxLength(500)
  // an uploaded file path or an absolute URL returned by the upload endpoint
  @Matches(/^(\/uploads\/|https?:\/\/)/, { message: 'url must be an uploaded file path or an http(s) URL' })
  url: string;
}
