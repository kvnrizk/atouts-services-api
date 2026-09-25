import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscriberRepository: Repository<NewsletterSubscriber>,
  ) {}

  async subscribe(email: string): Promise<{ message: string }> {
    const existing = await this.subscriberRepository.findOne({ where: { email } });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        existing.unsubscribedAt = null;
        await this.subscriberRepository.save(existing);
        return { message: 'Vous êtes de nouveau inscrit à notre newsletter.' };
      }
      return { message: 'Vous êtes déjà inscrit à notre newsletter.' };
    }

    const subscriber = this.subscriberRepository.create({ email });
    await this.subscriberRepository.save(subscriber);
    return { message: 'Inscription à la newsletter réussie !' };
  }

  /**
   * One-click unsubscribe. Always answers the same way so the endpoint can't be used
   * to find out whether an email is subscribed.
   */
  async unsubscribe(token: string): Promise<{ message: string }> {
    const subscriber = await this.subscriberRepository.findOne({ where: { unsubscribeToken: token } });
    if (subscriber?.isActive) {
      subscriber.isActive = false;
      subscriber.unsubscribedAt = new Date();
      await this.subscriberRepository.save(subscriber);
    }
    return { message: 'Vous êtes désinscrit de notre newsletter. Vos données seront supprimées sous 24 h.' };
  }

  async findAll(): Promise<NewsletterSubscriber[]> {
    return await this.subscriberRepository.find({
      order: { subscribedAt: 'DESC' },
    });
  }
}
