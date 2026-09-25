import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectDocument } from './entities/project-document.entity';
import { ProjectUpdate } from './entities/project-update.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddProjectDocumentDto } from './dto/add-project-document.dto';
import { AddProjectUpdateDto } from './dto/add-project-update.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectDocument)
    private readonly documentRepository: Repository<ProjectDocument>,
    @InjectRepository(ProjectUpdate)
    private readonly updateRepository: Repository<ProjectUpdate>,
  ) {}

  private async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const lastProject = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.reference_number LIKE :pattern', {
        pattern: `AS-${year}-%`,
      })
      .orderBy('project.id', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastProject) {
      const parts = lastProject.reference_number.split('-');
      nextNumber = parseInt(parts[2], 10) + 1;
    }

    return `AS-${year}-${String(nextNumber).padStart(4, '0')}`;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const reference_number = await this.generateReferenceNumber();

    const deposit_amount =
      dto.total_amount && dto.deposit_percentage
        ? (dto.total_amount * dto.deposit_percentage) / 100
        : null;

    const project = this.projectRepository.create({
      ...dto,
      reference_number,
      deposit_amount,
    });

    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['client', 'documents', 'updates'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['client', 'quote_request', 'documents', 'updates'],
    });

    if (!project) {
      throw new NotFoundException(`Project #${id} not found`);
    }

    return project;
  }

  async findByClientId(clientId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { client_id: clientId },
      relations: ['documents', 'updates'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findById(id);

    Object.assign(project, dto);

    if (dto.total_amount || dto.deposit_percentage) {
      const totalAmount = dto.total_amount ?? project.total_amount;
      const depositPct = dto.deposit_percentage ?? project.deposit_percentage;
      if (totalAmount && depositPct) {
        project.deposit_amount = (totalAmount * depositPct) / 100;
      }
    }

    return await this.projectRepository.save(project);
  }

  async addDocument(
    projectId: number,
    dto: AddProjectDocumentDto,
    uploadedByRole: string = 'admin',
  ): Promise<ProjectDocument> {
    await this.findById(projectId);

    const document = this.documentRepository.create({
      ...dto,
      project_id: projectId,
      uploaded_by_role: uploadedByRole,
    });

    return await this.documentRepository.save(document);
  }

  async addUpdate(
    projectId: number,
    dto: AddProjectUpdateDto,
  ): Promise<ProjectUpdate> {
    await this.findById(projectId);

    const update = this.updateRepository.create({
      ...dto,
      project_id: projectId,
    });

    return await this.updateRepository.save(update);
  }

  async getStats() {
    const total = await this.projectRepository.count();

    const byStatus = await this.projectRepository
      .createQueryBuilder('project')
      .select('project.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('project.status')
      .getRawMany();

    const revenue = await this.projectRepository
      .createQueryBuilder('project')
      .select('SUM(project.total_amount)', 'total')
      .where('project.status = :status', { status: 'paye' })
      .getRawOne();

    return {
      total,
      byStatus,
      totalRevenue: revenue?.total || 0,
    };
  }
}
