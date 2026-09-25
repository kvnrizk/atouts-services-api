import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Enforces the retention periods published in the privacy policy (RGPD art. 5-1-e).
 * Keep RETENTION in sync with the "Durée de conservation" section of
 * /politique-de-confidentialite and with docs/RGPD-registre.md.
 */
export const RETENTION = {
  /** Prospects who never became clients — CNIL guideline for prospect data. */
  quoteRequestsYears: 3,
  /** Simulator estimates (feature disabled, table kept). */
  estimationsYears: 3,
  /** Client accounts: end of contract + limitation period. Only REPORTED, never auto-deleted (invoices, warranty claims). */
  clientAccountsYears: 5,
} as const;

export interface RetentionReport {
  dryRun: boolean;
  quoteRequestsDeleted: number;
  estimationsDeleted: number;
  newsletterUnsubscribedDeleted: number;
  clientAccountsToReview: number;
}

@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /** Every night at 03:00 (Paris time). Disable with RETENTION_ENABLED=false. */
  @Cron('0 3 * * *', { name: 'rgpd-retention', timeZone: 'Europe/Paris' })
  async nightly() {
    if (process.env.RETENTION_ENABLED === 'false') return;
    const report = await this.run(false);
    this.logger.log(`RGPD retention: ${JSON.stringify(report)}`);
  }

  /**
   * @param dryRun true = only count what would be deleted (used by tests and for checks).
   */
  async run(dryRun: boolean): Promise<RetentionReport> {
    const q = (sql: string) => this.dataSource.query(sql);
    const count = async (sql: string) => Number((await q(`SELECT count(*)::int AS n FROM (${sql}) t`))[0].n);

    // Quote requests with no activity for 3 years, unless they became a project (then they're client records).
    const oldQuotes = `
      SELECT id FROM quote_requests
      WHERE updated_at < now() - interval '${RETENTION.quoteRequestsYears} years'
        AND id NOT IN (SELECT quote_request_id FROM projects WHERE quote_request_id IS NOT NULL)`;
    const oldEstimations = `
      SELECT id FROM estimations
      WHERE updated_at < now() - interval '${RETENTION.estimationsYears} years'`;
    // Consent withdrawn: nothing justifies keeping the address.
    const unsubscribed = `SELECT id FROM newsletter_subscribers WHERE is_active = false`;
    // Client accounts untouched for 5 years with no project updated in 5 years: flag for a human decision.
    const staleClients = `
      SELECT u.id FROM users u
      WHERE u.role = 'client'
        AND u.updated_at < now() - interval '${RETENTION.clientAccountsYears} years'
        AND NOT EXISTS (
          SELECT 1 FROM projects p
          WHERE p.client_id = u.id AND p.updated_at >= now() - interval '${RETENTION.clientAccountsYears} years'
        )`;

    const report: RetentionReport = {
      dryRun,
      quoteRequestsDeleted: await count(oldQuotes),
      estimationsDeleted: await count(oldEstimations),
      newsletterUnsubscribedDeleted: await count(unsubscribed),
      clientAccountsToReview: await count(staleClients),
    };
    if (dryRun) return report;

    await this.dataSource.transaction(async (tx) => {
      await tx.query(`DELETE FROM quote_requests WHERE id IN (${oldQuotes})`);
      await tx.query(`DELETE FROM estimations WHERE id IN (${oldEstimations})`);
      await tx.query(`DELETE FROM newsletter_subscribers WHERE id IN (${unsubscribed})`);
    });
    if (report.clientAccountsToReview > 0) {
      this.logger.warn(
        `${report.clientAccountsToReview} client account(s) inactive for ${RETENTION.clientAccountsYears}+ years: review and delete manually if no legal reason to keep them.`,
      );
    }
    return report;
  }
}
