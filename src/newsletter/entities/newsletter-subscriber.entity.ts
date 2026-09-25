import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('newsletter_subscribers')
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn({ name: 'subscribed_at' })
  subscribedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
