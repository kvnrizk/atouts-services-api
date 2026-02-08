import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimationsService } from './estimations.service';
import { EstimationsController } from './estimations.controller';
import { Estimation } from './entities/estimation.entity';
import { PriceReferencesModule } from '../price-references/price-references.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estimation]),
    PriceReferencesModule,
    EmailModule,
  ],
  controllers: [EstimationsController],
  providers: [EstimationsService],
  exports: [EstimationsService],
})
export class EstimationsModule {}
