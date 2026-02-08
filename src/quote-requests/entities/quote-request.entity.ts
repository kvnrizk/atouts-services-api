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

  // Enhanced project details (multi-step form)
  @Column({ name: 'surface_area', nullable: true })
  @Expose({ name: 'surface_area' })
  surface_area: string;

  @Column({ nullable: true })
  rooms: string;

  @Column({ name: 'current_state', nullable: true })
  @Expose({ name: 'current_state' })
  current_state: string;

  @Column({ name: 'desired_timeline', nullable: true })
  @Expose({ name: 'desired_timeline' })
  desired_timeline: string;

  @Column({ name: 'budget_range', nullable: true })
  @Expose({ name: 'budget_range' })
  budget_range: string;

  // UTM tracking
  @Column({ name: 'utm_source', nullable: true })
  @Expose({ name: 'utm_source' })
  utm_source: string;

  @Column({ name: 'utm_medium', nullable: true })
  @Expose({ name: 'utm_medium' })
  utm_medium: string;

  @Column({ name: 'utm_campaign', nullable: true })
  @Expose({ name: 'utm_campaign' })
  utm_campaign: string;

  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updated_at: Date;
}
