import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'project_id' })
  project_id: number;

  @Column({ name: 'stripe_session_id', nullable: true })
  stripe_session_id: string;

  @Column({ name: 'stripe_payment_intent_id', nullable: true })
  stripe_payment_intent_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'pending' })
  status: string; // pending, completed, failed, refunded

  @Column({ name: 'payment_type' })
  payment_type: string; // deposit, final

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'receipt_url', nullable: true })
  receipt_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
