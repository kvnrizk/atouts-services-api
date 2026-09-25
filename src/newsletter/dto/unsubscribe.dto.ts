import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UnsubscribeDto {
  @ApiProperty({ description: 'Token from the unsubscribe link in the email' })
  @IsUUID()
  token: string;
}
