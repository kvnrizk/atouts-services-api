import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BeforeAfterService } from './before-after.service';
import { BeforeAfterController } from './before-after.controller';
import { BeforeAfter } from './entities/before-after.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BeforeAfter])],
  controllers: [BeforeAfterController],
  providers: [BeforeAfterService],
  exports: [BeforeAfterService],
})
export class BeforeAfterModule {}
