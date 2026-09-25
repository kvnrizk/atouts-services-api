import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from './project.entity';

@Entity('project_documents')
export class ProjectDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.documents)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id' })
  project_id: number;

  @Column()
  name: string;

  @Column({ name: 'file_url' })
  file_url: string;

  @Column({ name: 'document_type' })
  document_type: string; // devis, facture, photo, attestation

  @Column({ name: 'uploaded_by_role', default: 'admin' })
  uploaded_by_role: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
