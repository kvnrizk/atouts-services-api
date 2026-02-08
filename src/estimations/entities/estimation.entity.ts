import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('estimations')
export class Estimation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'session_id' })
  sessionId: string;

  @Column()
  category: string;

  @Column({ name: 'surface_area', type: 'decimal', precision: 10, scale: 2 })
  surfaceArea: number;

  @Column({ nullable: true })
  rooms: number;

  @Column({ name: 'quality_level', default: 'standard' })
  qualityLevel: string;

  @Column({ name: 'selected_items', type: 'jsonb' })
  selectedItems: Array<{
    workItem: string;
    label: string;
    quantity: number;
    unit: string;
    unitPriceLow: number;
    unitPriceMid: number;
    unitPriceHigh: number;
  }>;

  @Column({ name: 'total_low', type: 'decimal', precision: 10, scale: 2 })
  totalLow: number;

  @Column({ name: 'total_mid', type: 'decimal', precision: 10, scale: 2 })
  totalMid: number;

  @Column({ name: 'total_high', type: 'decimal', precision: 10, scale: 2 })
  totalHigh: number;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'converted_to_quote', default: false })
  convertedToQuote: boolean;

  @Column({ name: 'utm_source', nullable: true })
  utmSource: string;

  @Column({ name: 'utm_medium', nullable: true })
  utmMedium: string;

  @Column({ name: 'utm_campaign', nullable: true })
  utmCampaign: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
