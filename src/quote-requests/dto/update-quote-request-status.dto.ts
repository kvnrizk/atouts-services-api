import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuoteRequestStatusDto {
  @ApiProperty({
    example: 'en_cours',
    description: 'Status of the quote request',
    enum: ['nouveau', 'en_cours', 'traite', 'archive'],
  })
  @IsString()
  @IsIn(['nouveau', 'en_cours', 'traite', 'archive'])
  status: string;
}
