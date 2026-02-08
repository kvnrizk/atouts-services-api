import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityPagesService } from './city-pages.service';
import { CityPagesController } from './city-pages.controller';
import { CityPage } from './entities/city-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityPage])],
  controllers: [CityPagesController],
  providers: [CityPagesService],
  exports: [CityPagesService],
})
export class CityPagesModule {}
