import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { QuoteRequest } from '../../quote-requests/entities/quote-request.entity';
import { ProjectDocument } from './project-document.entity';
import { ProjectUpdate } from './project-update.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reference_number', unique: true })
  reference_number: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'client_id' })
  client: User;

  @Column({ name: 'client_id' })
  client_id: number;

  @ManyToOne(() => QuoteRequest, { nullable: true })
  @JoinColumn({ name: 'quote_request_id' })
  quote_request: QuoteRequest;

  @Column({ name: 'quote_request_id', nullable: true })
  quote_request_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'devis_en_cours' })
  status: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount: number;

  @Column({ name: 'deposit_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  deposit_amount: number;

  @Column({ name: 'deposit_percentage', type: 'int', default: 30 })
  deposit_percentage: number;

  @Column({ name: 'estimated_start_date', type: 'date', nullable: true })
  estimated_start_date: Date;

  @Column({ name: 'estimated_end_date', type: 'date', nullable: true })
  estimated_end_date: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => ProjectDocument, (doc) => doc.project)
  documents: ProjectDocument[];

  @OneToMany(() => ProjectUpdate, (update) => update.project)
  updates: ProjectUpdate[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
