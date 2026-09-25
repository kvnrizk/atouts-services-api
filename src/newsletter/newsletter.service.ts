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
        await this.subscriberRepository.save(existing);
        return { message: 'Vous êtes de nouveau inscrit à notre newsletter.' };
      }
      return { message: 'Vous êtes déjà inscrit à notre newsletter.' };
    }

    const subscriber = this.subscriberRepository.create({ email });
    await this.subscriberRepository.save(subscriber);
    return { message: 'Inscription à la newsletter réussie !' };
  }

  async findAll(): Promise<NewsletterSubscriber[]> {
    return await this.subscriberRepository.find({
      order: { subscribedAt: 'DESC' },
    });
  }
}
