import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  async getDashboard() {
    const [quotes, projects, payments, estimations] = await Promise.all([
      this.dataSource.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'nouveau') as nouveau,
          COUNT(*) FILTER (WHERE status = 'en_cours') as en_cours,
          COUNT(*) FILTER (WHERE status = 'traite') as traite
        FROM quote_requests
      `),
      this.dataSource.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'paye') as paid,
          COALESCE(SUM(total_amount) FILTER (WHERE status = 'paye'), 0) as revenue
        FROM projects
      `),
      this.dataSource.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as amount
        FROM payments
      `).catch(() => [{ total: 0, completed: 0, amount: 0 }]),
      this.dataSource.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE email IS NOT NULL) as with_contact
        FROM estimations
      `),
    ]);

    return {
      quotes: quotes[0],
      projects: projects[0],
      payments: payments[0],
      estimations: estimations[0],
    };
  }

  async getRevenue() {
    const data = await this.dataSource.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        SUM(amount) as revenue,
        COUNT(*) as count
      FROM payments
      WHERE status = 'completed'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `).catch(() => []);

    return data.reverse();
  }

  async getConversions() {
    const [estimations, quotes, projects, payments] = await Promise.all([
      this.dataSource.query(`SELECT COUNT(*) as count FROM estimations`),
      this.dataSource.query(`SELECT COUNT(*) as count FROM quote_requests`),
      this.dataSource.query(`SELECT COUNT(*) as count FROM projects`),
      this.dataSource.query(`SELECT COUNT(*) as count FROM payments WHERE status = 'completed'`).catch(() => [{ count: 0 }]),
    ]);

    return {
      estimations: Number(estimations[0]?.count || 0),
      quotes: Number(quotes[0]?.count || 0),
      projects: Number(projects[0]?.count || 0),
      payments: Number(payments[0]?.count || 0),
    };
  }

  async getQuoteTrends() {
    const data = await this.dataSource.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(*) as count,
        COUNT(*) FILTER (WHERE status = 'traite') as converted
      FROM quote_requests
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `);

    return data.reverse();
  }

  async getSources() {
    const data = await this.dataSource.query(`
      SELECT
        COALESCE(utm_source, 'direct') as source,
        COUNT(*) as count
      FROM quote_requests
      GROUP BY COALESCE(utm_source, 'direct')
      ORDER BY count DESC
      LIMIT 10
    `);

    return data;
  }

  async getPopularServices() {
    const data = await this.dataSource.query(`
      SELECT
        COALESCE(project_type, 'Non spécifié') as service,
        COUNT(*) as count
      FROM quote_requests
      GROUP BY project_type
      ORDER BY count DESC
      LIMIT 10
    `);

    return data;
  }
}
