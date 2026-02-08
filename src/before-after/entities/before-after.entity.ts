import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('before_after')
export class BeforeAfter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'before_image_url' })
  beforeImageUrl: string;

  @Column({ name: 'after_image_url' })
  afterImageUrl: string;

  @Column()
  category: string; // peinture, renovation, electricite, salles-de-bains, revetements-sol

  @Column({ default: true })
  published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
