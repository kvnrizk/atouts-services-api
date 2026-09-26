import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteImageOverride } from './entities/site-image-override.entity';
import { SiteImagesService } from './site-images.service';
import { SiteImagesController } from './site-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SiteImageOverride])],
  controllers: [SiteImagesController],
  providers: [SiteImagesService],
})
export class SiteImagesModule {}
