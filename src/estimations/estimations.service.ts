import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estimation } from './entities/estimation.entity';
import { CalculateEstimationDto } from './dto/calculate-estimation.dto';
import { CaptureContactDto } from './dto/capture-contact.dto';
import { PriceReferencesService } from '../price-references/price-references.service';
import { EmailService } from '../email/email.service';
import { PdfService } from './pdf.service';
import { v4 as uuidv4 } from 'uuid';

const QUALITY_MULTIPLIERS: Record<string, number> = {
  eco: 0.85,
  standard: 1.0,
  premium: 1.3,
};

@Injectable()
export class EstimationsService {
  private readonly logger = new Logger(EstimationsService.name);

  constructor(
    @InjectRepository(Estimation)
    private readonly estimationRepository: Repository<Estimation>,
    private readonly priceReferencesService: PriceReferencesService,
    private readonly emailService: EmailService,
    private readonly pdfService: PdfService,
  ) {}

  async calculate(dto: CalculateEstimationDto) {
    const priceRefs = await this.priceReferencesService.findByCategory(dto.category);
    const qualityMultiplier = QUALITY_MULTIPLIERS[dto.qualityLevel] || 1.0;

    const items = dto.selectedItems
      .map((selected) => {
        const ref = priceRefs.find((r) => r.workItem === selected.workItem);
        if (!ref) return null;
        return {
          workItem: ref.workItem,
          label: ref.label,
          quantity: selected.quantity,
          unit: ref.unit,
          unitPriceLow: Number(ref.priceLow) * qualityMultiplier,
          unitPriceMid: Number(ref.priceMid) * qualityMultiplier,
          unitPriceHigh: Number(ref.priceHigh) * qualityMultiplier,
        };
      })
      .filter(Boolean);

    const totalLow = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPriceLow,
      0,
    );
    const totalMid = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPriceMid,
      0,
    );
    const totalHigh = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPriceHigh,
      0,
    );

    const sessionId = uuidv4();

    const estimation = this.estimationRepository.create({
      sessionId,
      category: dto.category,
      surfaceArea: dto.surfaceArea,
      rooms: dto.rooms,
      qualityLevel: dto.qualityLevel,
      selectedItems: items,
      totalLow: Math.round(totalLow * 100) / 100,
      totalMid: Math.round(totalMid * 100) / 100,
      totalHigh: Math.round(totalHigh * 100) / 100,
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
    });

    await this.estimationRepository.save(estimation);

    return {
      sessionId,
      totalLow: estimation.totalLow,
      totalMid: estimation.totalMid,
      totalHigh: estimation.totalHigh,
      items: items.map((item) => ({
        label: item.label,
        quantity: item.quantity,
        unit: item.unit,
        totalLow: Math.round(item.quantity * item.unitPriceLow * 100) / 100,
        totalMid: Math.round(item.quantity * item.unitPriceMid * 100) / 100,
        totalHigh: Math.round(item.quantity * item.unitPriceHigh * 100) / 100,
      })),
    };
  }

  async captureContact(sessionId: string, dto: CaptureContactDto) {
    const estimation = await this.estimationRepository.findOne({
      where: { sessionId },
    });

    if (!estimation) {
      throw new NotFoundException(`Estimation with session ${sessionId} not found`);
    }

    estimation.firstName = dto.firstName;
    estimation.lastName = dto.lastName;
    estimation.email = dto.email;
    estimation.phone = dto.phone;

    await this.estimationRepository.save(estimation);

    // Send notification email to admin + PDF to lead asynchronously
    this.sendEstimationNotification(estimation).catch((err) =>
      this.logger.error('Failed to send estimation notification', err),
    );
    this.sendEstimationPdfToLead(estimation).catch((err) =>
      this.logger.error('Failed to send estimation PDF to lead', err),
    );

    return { success: true };
  }

  async generatePdf(sessionId: string): Promise<Buffer> {
    const estimation = await this.estimationRepository.findOne({
      where: { sessionId },
    });
    if (!estimation) {
      throw new NotFoundException(`Estimation with session ${sessionId} not found`);
    }
    return this.pdfService.generateEstimationPdf(estimation);
  }

  async findAll(): Promise<Estimation[]> {
    return await this.estimationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getStats() {
    const total = await this.estimationRepository.count();
    const withContact = await this.estimationRepository.count({
      where: { email: undefined },
    });
    // Use query builder for non-null email count
    const withContactCount = await this.estimationRepository
      .createQueryBuilder('e')
      .where('e.email IS NOT NULL')
      .getCount();

    const avgResult = await this.estimationRepository
      .createQueryBuilder('e')
      .select('AVG(e.total_mid)', 'avg')
      .getRawOne();

    return {
      total,
      withContact: withContactCount,
      conversionRate: total > 0 ? Math.round((withContactCount / total) * 100) : 0,
      avgEstimate: avgResult?.avg ? Math.round(Number(avgResult.avg)) : 0,
    };
  }

  private async sendEstimationPdfToLead(estimation: Estimation) {
    if (!estimation.email) return;

    const categoryLabels: Record<string, string> = {
      peinture: 'Peinture',
      renovation: 'Renovation',
      electricite: 'Electricite',
      'salles-de-bains': 'Salle de bain',
      'revetements-sol': 'Revetement de sol',
    };

    const pdfBuffer = await this.pdfService.generateEstimationPdf(estimation);

    await this.emailService.sendEstimationReport(
      estimation.email,
      estimation.firstName,
      categoryLabels[estimation.category] || estimation.category,
      Number(estimation.totalLow),
      Number(estimation.totalHigh),
      pdfBuffer,
    );
  }

  private async sendEstimationNotification(estimation: Estimation) {
    const categoryLabels: Record<string, string> = {
      peinture: 'Peinture',
      renovation: 'Renovation',
      electricite: 'Electricite',
      'salles-de-bains': 'Salle de bain',
      'revetements-sol': 'Revetement de sol',
    };

    const subject = `Nouveau lead simulateur - ${categoryLabels[estimation.category] || estimation.category}`;
    const html = `
      <h2>Nouveau lead via le simulateur de prix</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Nom</td><td style="padding: 8px; border: 1px solid #ddd;">${estimation.firstName} ${estimation.lastName}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${estimation.email}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Telephone</td><td style="padding: 8px; border: 1px solid #ddd;">${estimation.phone || '-'}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Service</td><td style="padding: 8px; border: 1px solid #ddd;">${categoryLabels[estimation.category] || estimation.category}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Surface</td><td style="padding: 8px; border: 1px solid #ddd;">${estimation.surfaceArea} m2</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Qualite</td><td style="padding: 8px; border: 1px solid #ddd;">${estimation.qualityLevel}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Estimation</td><td style="padding: 8px; border: 1px solid #ddd;">${estimation.totalLow} - ${estimation.totalHigh} EUR (mid: ${estimation.totalMid} EUR)</td></tr>
      </table>
    `;

    await this.emailService.sendRawEmail(subject, html);
  }
}
