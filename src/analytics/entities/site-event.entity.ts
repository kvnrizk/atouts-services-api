import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

/**
 * Conversion events on the public site (phone click, quote form step, quote sent), with the same
 * anonymous context as PageView so they can be attributed to a source / campaign / service.
 * Deleted after 25 months by RetentionService.
 */
@Entity('site_events')
@Index(['createdAt', 'name'])
export class SiteEvent {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /** phone_click | quote_step | quote_submitted */
  @Column({ length: 40 })
  name: string;

  @Column({ length: 300 })
  path: string;

  /** Small, non-personal details: { location } for clicks, { step } for form steps, { service } for quotes */
  @Column({ type: 'jsonb', default: {} })
  props: Record<string, string>;

  @Column({ length: 100 })
  source: string;

  @Column({ name: 'utm_campaign', type: 'varchar', length: 150, nullable: true })
  utmCampaign: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ length: 10 })
  device: string;

  @Column({ length: 16 })
  visitor: string;
}
