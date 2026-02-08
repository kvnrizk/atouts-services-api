import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('city_pages')
export class CityPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'city_name' })
  cityName: string;

  @Column({ nullable: true })
  department: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'hero_image_url', nullable: true })
  heroImageUrl: string;

  @Column({ name: 'meta_title', nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription: string;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
