import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import type { QuoteRequest } from '../quote-requests/entities/quote-request.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly adminEmail: string;
  private readonly fromEmail: string;
  private readonly companyName = 'Atouts Services';
  private readonly templateCache = new Map<string, Handlebars.TemplateDelegate>();

  constructor(private configService: ConfigService) {
    this.adminEmail = this.configService.get('ADMIN_EMAIL', 'atouts.services92@gmail.com');
    this.fromEmail = this.configService.get('SMTP_FROM', 'noreply@atoutservice92.fr');

    const smtpHost = this.configService.get('SMTP_HOST');
    if (smtpHost) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: +this.configService.get('SMTP_PORT', '587'),
        secure: this.configService.get('SMTP_SECURE', 'false') === 'true',
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
      this.logger.log('Email transporter configured');
    } else {
      this.logger.warn('SMTP not configured — emails will be logged only');
    }

    this.registerPartials();
  }

  private registerPartials(): void {
    try {
      const baseTemplate = this.loadTemplateFile('base');
      Handlebars.registerPartial('base', baseTemplate);
    } catch (error) {
      this.logger.warn(`Could not load base template partial: ${error.message}`);
    }
  }

  private loadTemplateFile(name: string): string {
    const templatePath = path.join(__dirname, 'templates', `${name}.hbs`);
    return fs.readFileSync(templatePath, 'utf-8');
  }

  private compileTemplate(name: string, data: Record<string, unknown>): string {
    if (!this.templateCache.has(name)) {
      const source = this.loadTemplateFile(name);
      this.templateCache.set(name, Handlebars.compile(source));
    }
    return this.templateCache.get(name)!(data);
  }

  private async send(
    to: string,
    subject: string,
    html: string,
    attachments?: Array<{ filename: string; content: Buffer; contentType?: string }>,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}${attachments?.length ? ` | Attachments: ${attachments.map(a => a.filename).join(', ')}` : ''}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"${this.companyName}" <${this.fromEmail}>`,
        to,
        subject,
        html,
        attachments,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }

  async sendAdminNotification(quote: QuoteRequest): Promise<void> {
    const projectLabel = this.getProjectLabel(quote.project_type);
    const subject = `Nouvelle demande de devis — ${quote.first_name} ${quote.last_name} (${projectLabel})`;

    const html = this.compileTemplate('admin-notification', {
      firstName: quote.first_name,
      lastName: quote.last_name,
      email: quote.email,
      phone: quote.phone,
      projectLabel,
      surfaceArea: quote.surface_area,
      rooms: quote.rooms,
      currentState: quote.current_state ? this.getStateLabel(quote.current_state) : null,
      timeline: quote.desired_timeline,
      budget: quote.budget_range,
      message: quote.message,
      utmSource: quote.utm_source,
      utmMedium: quote.utm_medium || '-',
      utmCampaign: quote.utm_campaign || '-',
      dashboardUrl: `${this.siteUrl}/admin/quotes`,
    });

    await this.send(this.adminEmail, subject, html);
  }

  /** Public site address for links in emails: FRONTEND_URL is a comma-separated CORS list, the first entry is the site */
  private get siteUrl(): string {
    return this.configService.get('FRONTEND_URL', 'http://localhost:3000').split(',')[0].trim();
  }

  async sendClientConfirmation(quote: QuoteRequest): Promise<void> {
    const subject = `${this.companyName} — Votre demande de devis a bien été reçue`;

    const html = this.compileTemplate('client-confirmation', {
      firstName: quote.first_name,
      projectLabel: this.getProjectLabel(quote.project_type),
      message: quote.message,
    });

    await this.send(quote.email, subject, html);
  }

  async sendQuoteStatusUpdate(
    email: string,
    firstName: string,
    statusLabel: string,
    statusMessage?: string,
  ): Promise<void> {
    const subject = `${this.companyName} — Mise à jour de votre demande`;

    const html = this.compileTemplate('quote-status-update', {
      firstName,
      statusLabel,
      statusMessage,
    });

    await this.send(email, subject, html);
  }

  async sendPaymentReceipt(
    email: string,
    data: {
      firstName: string;
      projectTitle: string;
      referenceNumber: string;
      paymentType: string;
      amount: string;
    },
  ): Promise<void> {
    const subject = `${this.companyName} — Confirmation de paiement`;

    const html = this.compileTemplate('payment-receipt', {
      ...data,
      portalUrl: `${this.siteUrl}/espace-client/projets`,
    });

    await this.send(email, subject, html);
  }

  async sendClientWelcome(email: string, firstName: string): Promise<void> {
    const subject = `${this.companyName} — Bienvenue sur votre espace client`;

    const html = this.compileTemplate('client-welcome', {
      firstName,
      portalUrl: `${this.siteUrl}/espace-client`,
    });

    await this.send(email, subject, html);
  }

  async sendEstimationReport(
    email: string,
    firstName: string,
    categoryLabel: string,
    totalLow: number,
    totalHigh: number,
    pdfBuffer: Buffer,
  ): Promise<void> {
    const subject = `${this.companyName} — Votre estimation de prix`;

    const html = this.compileTemplate('estimation-report', {
      firstName,
      categoryLabel,
      totalLow: Math.round(totalLow),
      totalHigh: Math.round(totalHigh),
    });

    await this.send(email, subject, html, [
      {
        filename: `estimation-atouts-services.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ]);
  }

  async sendRawEmail(subject: string, html: string): Promise<void> {
    await this.send(this.adminEmail, subject, html);
  }

  async sendToClient(to: string, subject: string, html: string): Promise<void> {
    await this.send(to, subject, html);
  }

  private getProjectLabel(type: string | null): string {
    const labels: Record<string, string> = {
      peinture: 'Peinture',
      renovation: 'Rénovation',
      electricite: 'Électricité',
      'salles-de-bains': 'Salles de bains',
      'revetements-sol': 'Revêtements de sol',
      autre: 'Autre',
    };
    return type ? labels[type] || type : 'Non spécifié';
  }

  private getStateLabel(state: string): string {
    const labels: Record<string, string> = {
      bon_etat: 'Bon état',
      a_rafraichir: 'À rafraîchir',
      a_renover: 'À rénover complètement',
    };
    return labels[state] || state;
  }
}
