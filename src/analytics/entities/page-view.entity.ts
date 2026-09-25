import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

/**
 * One public page view. Cookieless audience measurement (CNIL exemption): no IP, no full
 * user-agent, no full referrer URL; `visitor` is a hash that changes every day.
 * Deleted after 25 months by RetentionService.
 */
@Entity('page_views')
@Index(['createdAt'])
export class PageView {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ length: 300 })
  path: string;

  /** Google, Google Ads, Bing, Facebook, Instagram, LinkedIn, Direct, or the referring host */
  @Column({ length: 100 })
  source: string;

  @Column({ name: 'referrer_host', type: 'varchar', length: 200, nullable: true })
  referrerHost: string | null;

  @Column({ name: 'utm_source', type: 'varchar', length: 100, nullable: true })
  utmSource: string | null;

  @Column({ name: 'utm_medium', type: 'varchar', length: 100, nullable: true })
  utmMedium: string | null;

  @Column({ name: 'utm_campaign', type: 'varchar', length: 150, nullable: true })
  utmCampaign: string | null;

  @Column({ type: 'varchar', length: 2, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  /** mobile | tablet | desktop */
  @Column({ length: 10 })
  device: string;

  /** Daily-rotating hash of (IP + user-agent): counts unique visitors per day, can't follow anyone across days */
  @Column({ length: 16 })
  visitor: string;
}
