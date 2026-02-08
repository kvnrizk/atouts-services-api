import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceReferencesService } from './price-references.service';
import { PriceReferencesController } from './price-references.controller';
import { PriceReference } from './entities/price-reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PriceReference])],
  controllers: [PriceReferencesController],
  providers: [PriceReferencesService],
  exports: [PriceReferencesService],
})
export class PriceReferencesModule {}
