import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ProjectDocument } from './entities/project-document.entity';
import { ProjectUpdate } from './entities/project-update.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectDocument, ProjectUpdate])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
