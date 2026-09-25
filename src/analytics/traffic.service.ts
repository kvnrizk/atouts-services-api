import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PageView } from './entities/page-view.entity';
import { SiteEvent } from './entities/site-event.entity';
import { CollectDto } from './dto/collect.dto';

/** Only these small, non-personal keys are kept in event props. */
const ALLOWED_PROPS = ['location', 'step', 'service'] as const;

export interface TrafficReport {
  days: number;
  totals: { visitors: number; pageViews: number; quotes: number; phoneClicks: number; conversionRate: number };
  timeline: { date: string; visitors: number; pageViews: number }[];
  sources: { source: string; visitors: number; quotes: number; phoneClicks: number }[];
  campaigns: { campaign: string; visitors: number; quotes: number; phoneClicks: number }[];
  cities: { city: string; visitors: number }[];
  pages: { path: string; pageViews: number }[];
  devices: { device: string; visitors: number }[];
  services: { service: string; visits: number; quotes: number }[];
  quoteFunnel: { step: string; visitors: number }[];
}

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(PageView) private readonly pageViews: Repository<PageView>,
    @InjectRepository(SiteEvent) private readonly events: Repository<SiteEvent>,
    @InjectDataSource() private readonly db: DataSource,
  ) {}

  async collect(dto: CollectDto): Promise<void> {
    const c = dto.context;
    if (dto.type === 'pageview') {
      await this.pageViews.insert({
        path: c.path,
        source: c.source,
        referrerHost: c.referrerHost ?? null,
        utmSource: c.utmSource ?? null,
        utmMedium: c.utmMedium ?? null,
        utmCampaign: c.utmCampaign ?? null,
        country: c.country ?? null,
        city: c.city ?? null,
        device: c.device,
        visitor: c.visitor,
      });
      return;
    }
    if (!dto.name) return;
    const props: Record<string, string> = {};
    for (const key of ALLOWED_PROPS) {
      const v = dto.props?.[key];
      if (typeof v === 'string' && v.length <= 60) props[key] = v;
    }
    await this.events.insert({
      name: dto.name,
      path: c.path,
      props,
      source: c.source,
      utmCampaign: c.utmCampaign ?? null,
      city: c.city ?? null,
      device: c.device,
      visitor: c.visitor,
    });
  }

  /**
   * Dashboard report. A "visitor" is a (daily hash, day) pair: the hash rotates every day, so
   * this counts unique visitors per day, summed over the period (same method as Plausible).
   */
  async report(days: number): Promise<TrafficReport> {
    const since = `now() - interval '${days} days'`;
    const pv = `FROM page_views WHERE created_at >= ${since}`;
    const ev = `FROM site_events WHERE created_at >= ${since}`;
    const uniq = `count(DISTINCT (visitor, created_at::date))::int`;
    const q = <T>(sql: string): Promise<T[]> => this.db.query(sql);
    const bucket = days > 90 ? 'week' : 'day';

    const [totals] = await q<{ visitors: number; pageViews: number }>(
      `SELECT ${uniq} AS "visitors", count(*)::int AS "pageViews" ${pv}`,
    );
    const [conv] = await q<{ quotes: number; phoneClicks: number; converted: number }>(
      `SELECT count(*) FILTER (WHERE name = 'quote_submitted')::int AS "quotes",
              count(*) FILTER (WHERE name = 'phone_click')::int AS "phoneClicks",
              count(DISTINCT (visitor, created_at::date)) FILTER (WHERE name IN ('quote_submitted', 'phone_click'))::int AS "converted"
       ${ev}`,
    );

    // Conversions per dimension, joined onto visitors per dimension
    const withConversions = (dim: string, alias: string, where = '') => `
      SELECT v.${alias}, v.visitors, coalesce(e.quotes, 0)::int AS quotes, coalesce(e.calls, 0)::int AS "phoneClicks"
      FROM (SELECT ${dim} AS ${alias}, ${uniq} AS visitors ${pv} ${where} GROUP BY 1) v
      LEFT JOIN (
        SELECT ${dim} AS ${alias},
               count(*) FILTER (WHERE name = 'quote_submitted') AS quotes,
               count(*) FILTER (WHERE name = 'phone_click') AS calls
        ${ev} ${where} GROUP BY 1
      ) e USING (${alias})
      ORDER BY v.visitors DESC LIMIT 10`;

    // /services/<slug> and /en/services/<slug> both count for the service
    const serviceSlug = `substring(path from '^(?:/en)?/services/([a-z0-9-]+)')`;

    const [timeline, sources, campaigns, cities, pages, devices, services, funnel] = await Promise.all([
      q<{ date: string; visitors: number; pageViews: number }>(
        `SELECT to_char(date_trunc('${bucket}', created_at), 'YYYY-MM-DD') AS date,
                ${uniq} AS "visitors", count(*)::int AS "pageViews" ${pv} GROUP BY 1 ORDER BY 1`,
      ),
      q<TrafficReport['sources'][number]>(withConversions('source', 'source')),
      q<TrafficReport['campaigns'][number]>(withConversions('utm_campaign', 'campaign', 'AND utm_campaign IS NOT NULL')),
      q<TrafficReport['cities'][number]>(
        `SELECT coalesce(city, 'Inconnue') AS city, ${uniq} AS visitors ${pv} GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      ),
      q<TrafficReport['pages'][number]>(
        `SELECT path, count(*)::int AS "pageViews" ${pv} GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      ),
      q<TrafficReport['devices'][number]>(`SELECT device, ${uniq} AS visitors ${pv} GROUP BY 1 ORDER BY 2 DESC`),
      q<TrafficReport['services'][number]>(`
        SELECT s.service, s.visits, coalesce(e.quotes, 0)::int AS quotes
        FROM (SELECT ${serviceSlug} AS service, count(*)::int AS visits ${pv} AND ${serviceSlug} IS NOT NULL GROUP BY 1) s
        LEFT JOIN (SELECT props->>'service' AS service, count(*) AS quotes ${ev} AND name = 'quote_submitted' GROUP BY 1) e
        USING (service) ORDER BY s.visits DESC`),
      q<{ step: string; visitors: number }>(`
        SELECT props->>'step' AS step, ${uniq} AS visitors ${ev} AND name = 'quote_step'
        GROUP BY 1 ORDER BY 1`),
    ]);

    const quoteFunnel = [...funnel, { step: 'Envoyé', visitors: conv.quotes }];
    // Share of visitors who called or asked for a quote (a visitor converting twice counts once)
    const conversionRate = totals.visitors ? Math.min(100, Math.round((conv.converted / totals.visitors) * 1000) / 10) : 0;

    return {
      days,
      totals: { ...totals, quotes: conv.quotes, phoneClicks: conv.phoneClicks, conversionRate },
      timeline,
      sources,
      campaigns,
      cities,
      pages,
      devices,
      services,
      quoteFunnel,
    };
  }
}
