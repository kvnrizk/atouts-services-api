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

  // Enhanced project details (multi-step form)
  @ApiProperty({ example: '70', description: 'Surface area in m2', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  surface_area?: string;

  @ApiProperty({ example: '3', description: 'Number of rooms', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  rooms?: string;

  @ApiProperty({ example: 'a_rafraichir', description: 'Current state of the project', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  current_state?: string;

  @ApiProperty({ example: '1-3-mois', description: 'Desired timeline', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  desired_timeline?: string;

  @ApiProperty({ example: '5000-10000', description: 'Budget range', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  budget_range?: string;

  // UTM tracking
  @ApiProperty({ description: 'UTM source parameter', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_source?: string;

  @ApiProperty({ description: 'UTM medium parameter', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_medium?: string;

  @ApiProperty({ description: 'UTM campaign parameter', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  utm_campaign?: string;
}
