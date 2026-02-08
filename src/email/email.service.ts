import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { QuoteRequest } from '../quote-requests/entities/quote-request.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly adminEmail: string;
  private readonly fromEmail: string;
  private readonly companyName = 'Atouts Services';

  constructor(private configService: ConfigService) {
    this.adminEmail = this.configService.get('ADMIN_EMAIL', 'contact@atouts-services.fr');
    this.fromEmail = this.configService.get('SMTP_FROM', 'noreply@atouts-services.fr');

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
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"${this.companyName}" <${this.fromEmail}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }

  /**
   * Notify admin of a new quote request
   */
  async sendAdminNotification(quote: QuoteRequest): Promise<void> {
    const projectLabel = this.getProjectLabel(quote.project_type);
    const subject = `Nouvelle demande de devis — ${quote.first_name} ${quote.last_name} (${projectLabel})`;

    const utmInfo = quote.utm_source
      ? `<p style="color:#888;font-size:12px;">Source: ${quote.utm_source || '-'} / ${quote.utm_medium || '-'} / ${quote.utm_campaign || '-'}</p>`
      : '';

    const detailsRows = [
      quote.surface_area ? `<tr><td style="padding:4px 8px;font-weight:bold;">Surface</td><td style="padding:4px 8px;">${quote.surface_area} m²</td></tr>` : '',
      quote.rooms ? `<tr><td style="padding:4px 8px;font-weight:bold;">Pièces</td><td style="padding:4px 8px;">${quote.rooms}</td></tr>` : '',
      quote.current_state ? `<tr><td style="padding:4px 8px;font-weight:bold;">État actuel</td><td style="padding:4px 8px;">${this.getStateLabel(quote.current_state)}</td></tr>` : '',
      quote.desired_timeline ? `<tr><td style="padding:4px 8px;font-weight:bold;">Délai souhaité</td><td style="padding:4px 8px;">${quote.desired_timeline}</td></tr>` : '',
      quote.budget_range ? `<tr><td style="padding:4px 8px;font-weight:bold;">Budget</td><td style="padding:4px 8px;">${quote.budget_range}</td></tr>` : '',
    ].filter(Boolean).join('');

    const detailsTable = detailsRows
      ? `<h3 style="margin-top:16px;">Détails du projet</h3><table style="border-collapse:collapse;">${detailsRows}</table>`
      : '';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;">
        <h2 style="color:#2563eb;">Nouvelle demande de devis</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:4px 8px;font-weight:bold;">Nom</td><td style="padding:4px 8px;">${quote.first_name} ${quote.last_name}</td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold;">Email</td><td style="padding:4px 8px;"><a href="mailto:${quote.email}">${quote.email}</a></td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold;">Téléphone</td><td style="padding:4px 8px;"><a href="tel:${quote.phone}">${quote.phone}</a></td></tr>
          <tr><td style="padding:4px 8px;font-weight:bold;">Service</td><td style="padding:4px 8px;">${projectLabel}</td></tr>
        </table>
        ${detailsTable}
        <h3 style="margin-top:16px;">Message</h3>
        <p style="background:#f3f4f6;padding:12px;border-radius:8px;">${quote.message}</p>
        ${utmInfo}
        <p style="margin-top:24px;"><a href="${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/admin/quotes" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Voir dans le dashboard</a></p>
      </div>
    `;

    await this.send(this.adminEmail, subject, html);
  }

  /**
   * Send auto-reply confirmation to client
   */
  async sendClientConfirmation(quote: QuoteRequest): Promise<void> {
    const subject = `${this.companyName} — Votre demande de devis a bien été reçue`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;">
        <h2 style="color:#2563eb;">Merci ${quote.first_name} !</h2>
        <p>Nous avons bien reçu votre demande de devis et nous vous en remercions.</p>
        <p>Un membre de notre équipe vous recontactera <strong>sous 24 heures</strong> pour discuter de votre projet.</p>
        <div style="background:#eff6ff;padding:16px;border-radius:8px;margin:20px 0;">
          <h3 style="margin-top:0;color:#1e40af;">Récapitulatif de votre demande</h3>
          <p><strong>Service :</strong> ${this.getProjectLabel(quote.project_type)}</p>
          <p><strong>Message :</strong> ${quote.message}</p>
        </div>
        <p>En attendant, n'hésitez pas à consulter nos réalisations sur notre site.</p>
        <p>À très bientôt,<br /><strong>L'équipe ${this.companyName}</strong></p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#6b7280;font-size:12px;">
          ${this.companyName} — Rénovation & Travaux<br />
          Issy-les-Moulineaux — Hauts-de-Seine (92)<br />
          <a href="https://www.atouts-services.fr">www.atouts-services.fr</a>
        </p>
      </div>
    `;

    await this.send(quote.email, subject, html);
  }

  /**
   * Send a raw HTML email to the admin (used by other modules)
   */
  async sendRawEmail(subject: string, html: string): Promise<void> {
    await this.send(this.adminEmail, subject, html);
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
