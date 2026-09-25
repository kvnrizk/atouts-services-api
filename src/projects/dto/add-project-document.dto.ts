import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddProjectDocumentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  file_url: string;

  @ApiProperty({ enum: ['devis', 'facture', 'photo', 'attestation'] })
  @IsString()
  document_type: string;
}
