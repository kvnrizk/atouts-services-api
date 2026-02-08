import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ name: 'client_city', nullable: true })
  clientCity: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ name: 'project_type', nullable: true })
  projectType: string;

  @Column({ default: true })
  published: boolean;

  @Column({ default: false })
  featured: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
