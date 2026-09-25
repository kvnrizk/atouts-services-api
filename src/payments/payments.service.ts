import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { StripeService } from './stripe.service';
import { ProjectsService } from '../projects/projects.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly stripeService: StripeService,
    private readonly projectsService: ProjectsService,
    private readonly configService: ConfigService,
  ) {}

  async createCheckout(dto: CreateCheckoutDto, clientId: number) {
    if (!this.stripeService.isConfigured()) {
      throw new BadRequestException('Payment system not configured');
    }

    const project = await this.projectsService.findById(dto.project_id);

    if (project.client_id !== clientId) {
      throw new BadRequestException('Access denied');
    }

    let amount: number;
    let description: string;

    if (dto.payment_type === 'deposit') {
      if (!project.deposit_amount) {
        throw new BadRequestException('Project has no deposit amount configured');
      }
      amount = Number(project.deposit_amount);
      description = `Acompte - ${project.title} (Réf. ${project.reference_number})`;
    } else {
      if (!project.total_amount) {
        throw new BadRequestException('Project has no total amount configured');
      }
      const paidDeposit = await this.paymentRepository
        .createQueryBuilder('p')
        .select('SUM(p.amount)', 'total')
        .where('p.project_id = :pid', { pid: project.id })
        .andWhere('p.status = :status', { status: 'completed' })
        .getRawOne();

      amount = Number(project.total_amount) - Number(paidDeposit?.total || 0);
      description = `Solde final - ${project.title} (Réf. ${project.reference_number})`;
    }

    if (amount <= 0) {
      throw new BadRequestException('Nothing to pay');
    }

    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';

    const session = await this.stripeService.createCheckoutSession({
      amount,
      description,
      metadata: {
        project_id: String(project.id),
        payment_type: dto.payment_type,
        client_id: String(clientId),
      },
      successUrl: `${frontendUrl}/espace-client/paiement/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${frontendUrl}/espace-client/paiement/cancel`,
    });

    // Create pending payment record
    const payment = this.paymentRepository.create({
      project_id: project.id,
      stripe_session_id: session.id,
      amount,
      status: 'pending',
      payment_type: dto.payment_type,
      description,
    });

    await this.paymentRepository.save(payment);

    return { url: session.url };
  }

  async handleWebhookEvent(event: { type: string; data: { object: any } }) {
    this.logger.log(`Stripe webhook event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Record<string, unknown>;
      const sessionId = session.id as string;

      const payment = await this.paymentRepository.findOne({
        where: { stripe_session_id: sessionId },
      });

      if (payment) {
        payment.status = 'completed';
        payment.stripe_payment_intent_id = session.payment_intent as string;
        await this.paymentRepository.save(payment);

        // Update project status if it was a deposit
        const metadata = session.metadata as Record<string, string>;
        if (metadata?.payment_type === 'deposit') {
          await this.projectsService.update(payment.project_id, {
            status: 'acompte_recu',
          });
        }

        this.logger.log(`Payment completed for session ${sessionId}`);
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Record<string, unknown>;
      const sessionId = session.id as string;

      const payment = await this.paymentRepository.findOne({
        where: { stripe_session_id: sessionId },
      });

      if (payment && payment.status === 'pending') {
        payment.status = 'failed';
        await this.paymentRepository.save(payment);
      }
    }
  }

  async findByClientId(clientId: number): Promise<Payment[]> {
    return await this.paymentRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.project', 'project')
      .where('project.client_id = :clientId', { clientId })
      .orderBy('payment.created_at', 'DESC')
      .getMany();
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['project'],
      order: { created_at: 'DESC' },
    });
  }

  async getStats() {
    const total = await this.paymentRepository.count();

    const completed = await this.paymentRepository
      .createQueryBuilder('p')
      .select('SUM(p.amount)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('p.status = :status', { status: 'completed' })
      .getRawOne();

    const pending = await this.paymentRepository.count({
      where: { status: 'pending' },
    });

    return {
      total,
      completedCount: Number(completed?.count || 0),
      completedAmount: Number(completed?.total || 0),
      pendingCount: pending,
    };
  }

  async refund(paymentId: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
    });

    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'completed') {
      throw new BadRequestException('Can only refund completed payments');
    }
    if (!payment.stripe_payment_intent_id) {
      throw new BadRequestException('No payment intent to refund');
    }

    await this.stripeService.createRefund(payment.stripe_payment_intent_id);

    payment.status = 'refunded';
    return await this.paymentRepository.save(payment);
  }
}
