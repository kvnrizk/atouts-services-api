import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuoteRequestDto {
  @ApiProperty({ example: 'Jean', description: 'First name of the client' })
  @IsString()
  @MaxLength(100)
  first_name: string;

  @ApiProperty({ example: 'Dupont', description: 'Last name of the client' })
  @IsString()
  @MaxLength(100)
  last_name: string;

  @ApiProperty({ example: 'jean.dupont@example.com', description: 'Email address' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '01 23 45 67 89', description: 'Phone number' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    example: 'peinture',
    description: 'Type of project/service',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  project_type?: string;

  @ApiProperty({
    example: 'Je souhaite repeindre mon appartement de 70m2',
    description: 'Detailed message about the project',
  })
  @IsString()
  @MaxLength(2000)
  message: string;
}
