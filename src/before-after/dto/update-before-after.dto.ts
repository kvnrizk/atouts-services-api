import { PartialType } from '@nestjs/mapped-types';
import { CreateBeforeAfterDto } from './create-before-after.dto';

export class UpdateBeforeAfterDto extends PartialType(CreateBeforeAfterDto) {}
