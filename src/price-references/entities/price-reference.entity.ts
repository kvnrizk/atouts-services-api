import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('price_references')
export class PriceReference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column({ name: 'work_item' })
  workItem: string;

  @Column()
  label: string;

  @Column({ default: 'm2' })
  unit: string;

  @Column({ name: 'price_low', type: 'decimal', precision: 10, scale: 2 })
  priceLow: number;

  @Column({ name: 'price_mid', type: 'decimal', precision: 10, scale: 2 })
  priceMid: number;

  @Column({ name: 'price_high', type: 'decimal', precision: 10, scale: 2 })
  priceHigh: number;

  @Column({ default: true })
  active: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
