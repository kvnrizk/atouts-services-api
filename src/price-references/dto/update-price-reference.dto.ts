import { PartialType } from '@nestjs/swagger';
import { CreatePriceReferenceDto } from './create-price-reference.dto';

export class UpdatePriceReferenceDto extends PartialType(CreatePriceReferenceDto) {}
