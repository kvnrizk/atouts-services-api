import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectDocumentDto } from './dto/add-project-document.dto';
import { AddProjectUpdateDto } from './dto/add-project-update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  // ========================
  // Admin Endpoints
  // ========================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new project (Admin)' })
  @ApiResponse({ status: 201, description: 'Project created' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects (Admin)' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get project stats (Admin)' })
  getStats() {
    return this.projectsService.getStats();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project (Admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(id, dto);
  }

  @Post(':id/updates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a project update (Admin)' })
  addUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddProjectUpdateDto,
  ) {
    return this.projectsService.addUpdate(id, dto);
  }

  @Post(':id/documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a project document (Admin)' })
  addDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddProjectDocumentDto,
  ) {
    return this.projectsService.addDocument(id, dto, 'admin');
  }

  // ========================
  // Client Endpoints
  // ========================

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my projects (Client)' })
  findMyProjects(@Request() req) {
    return this.projectsService.findByClientId(req.user.id);
  }

  @Get('my/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one of my projects (Client)' })
  async findMyProject(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const project = await this.projectsService.findById(id);
    if (project.client_id !== req.user.id) {
      throw new ForbiddenException('Access denied');
    }
    return project;
  }
}
