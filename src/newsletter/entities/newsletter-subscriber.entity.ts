import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('newsletter_subscribers')
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  /** Date of the opt-in — proof of consent (RGPD art. 7). */
  @CreateDateColumn({ name: 'subscribed_at' })
  subscribedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  /** Secret put in every email's unsubscribe link; lets people unsubscribe without an account. */
  @Column({ name: 'unsubscribe_token', type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
  unsubscribeToken: string;

  /** Set on unsubscribe; the retention job then deletes the row (see RetentionService). */
  @Column({ name: 'unsubscribed_at', type: 'timestamp', nullable: true })
  unsubscribedAt: Date | null;
}
