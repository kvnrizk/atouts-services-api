import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

@Entity('quote_requests')
export class QuoteRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  @Expose({ name: 'first_name' })
  first_name: string;

  @Column({ name: 'last_name' })
  @Expose({ name: 'last_name' })
  last_name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: 'project_type', nullable: true })
  @Expose({ name: 'project_type' })
  project_type: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'nouveau' })
  status: string; // nouveau, en_cours, traite, archive

  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updated_at: Date;
}
