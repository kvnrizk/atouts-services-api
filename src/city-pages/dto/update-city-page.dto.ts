import { PartialType } from '@nestjs/swagger';
import { CreateCityPageDto } from './create-city-page.dto';

export class UpdateCityPageDto extends PartialType(CreateCityPageDto) {}
