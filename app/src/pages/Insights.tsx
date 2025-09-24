import type { FC } from 'react';
import styled from 'styled-components';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nProvider';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const InsightsContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  
  @media (min-width: 480px) {
    padding: 1rem;
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Section = styled.section`
  margin: 0 0 1.5rem 0;
  
  @media (min-width: 768px) {
    margin: 0 0 2rem 0;
  }
`;

const Header = styled.h1`
  color: ${props => props.theme.colors.headings};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 1.75rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.875rem;
    margin-bottom: 2rem;
  }
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  @media (min-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.85rem;
`;

const Select = styled.select`
  background: rgba(255,255,255,0.06);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  font-size: 0.9rem;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 0;
  width: 100%;
  max-width: 100%;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
`;

const InsightCard = styled.div`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const CardHeader = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
    margin: 0 0 1.5rem 0;
  }
`;

const EmptyStateContainer = styled.div`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  text-align: center;
  
  @media (min-width: 480px) {
    padding: 2rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 3rem;
  }
`;

const EmptyStateTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  
  @media (min-width: 480px) {
    font-size: 1.375rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
`;

const KPI = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
`;

const KPIValue = styled.div`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 700;
`;

const KPILabel = styled.div`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.85rem;
`;

const Trend = styled.span<{ up?: boolean; flat?: boolean }>`
  margin-left: 6px;
  font-size: 0.8rem;
  color: ${props => props.flat ? props.theme.colors.bodyText : (props.up ? props.theme.colors.success : props.theme.colors.error)};
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: saturate(120%) blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
`;

const ModalCard = styled.div`
  background-color: ${props => props.theme.glass.card};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 16px;
  padding: 1rem;
  width: 100%;
  max-width: 720px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
`;

const ModalTitle = styled.h3`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ListItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr 0.8fr;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:last-child { border-bottom: none; }
`;

// Add a 2-column grid for Weekly Progress items
const WeeklyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`;


// --- Types ---
interface AppRow {
  company_name: string | null;
  status: string | null;
  applied_date: string | null;
  interview_date: string | null;
  offer_date: string | null;
  rejected_date: string | null;
  url: string | null;
  position?: string | null;
}

export const Insights: FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raw apps cache
  const [appsRaw, setAppsRaw] = useState<AppRow[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  // Filters
  const [timeRange, setTimeRange] = useState<'7' | '30' | '180' | 'all'>('30');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  // Existing series
  const [successRateSeries, setSuccessRateSeries] = useState<Array<{ label: string; rate: number }>>([]);
  const [avgResponseSeries, setAvgResponseSeries] = useState<Array<{ label: string; days: number }>>([]);
  const [channelBars, setChannelBars] = useState<Array<{ channel: string; applications: number }>>([]);

  // KPIs and new charts
  const [kpi, setKpi] = useState({ total: 0, interviews: 0, offers: 0, accepted: 0, successRate: 0 });
  const [funnel, setFunnel] = useState<Array<{ stage: string; count: number }>>([]);
  const [topCompanies, setTopCompanies] = useState<Array<{ company: string; applications: number }>>([]);
  const [outcomes, setOutcomes] = useState<Array<{ name: string; value: number }>>([]);
  const [firstResponseByCompany, setFirstResponseByCompany] = useState<Array<{ company: string; days: number }>>([]);

  // Drilldown state
  const [drillOpen, setDrillOpen] = useState(false);
  const [drillTitle, setDrillTitle] = useState('');
  const [drillRows, setDrillRows] = useState<AppRow[]>([]);

  // Trends vs previous period
  const [kpiTrend, setKpiTrend] = useState<{ total: number; interviews: number; offers: number; successRate: number }>({ total: 0, interviews: 0, offers: 0, successRate: 0 });

  // Weekly summary (now includes rejections)
  const [weekly, setWeekly] = useState<{ apps: number; interviews: number; offers: number; rejections: number }>({ apps: 0, interviews: 0, offers: 0, rejections: 0 });

  // Interviews over time (weekly)
  const [interviewsSeries, setInterviewsSeries] = useState<Array<{ label: string; interviews: number }>>([]);

  // Heatmap daily counts for current month in filtered range (kept but not shown)
  const [, setHeatDays] = useState<Array<{ date: string; count: number }>>([]);

  const pieColors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#64748B'];

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const getWeekStart = useCallback((d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = date.getUTCDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(date);
    monday.setUTCDate(date.getUTCDate() + diff);
    return formatDate(monday);
  }, []);
  const normalizeChannel = useCallback((urlStr: string | null): string => {
    if (!urlStr) return 'Other';
    try {
      const host = new URL(urlStr).hostname.toLowerCase();
      if (host.includes('linkedin')) return 'LinkedIn';
      if (host.includes('finn')) return 'Finn';
      if (host.includes('indeed')) return 'Indeed';
      return 'Company Site';
    } catch {
      return 'Other';
    }
  }, []);

  // Fetch apps once and on demand
  const fetchApps = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('company_name, status, applied_date, interview_date, offer_date, rejected_date, url, position')
        .eq('user_id', user.id);
      if (error) throw error;
      const apps = (data || []) as AppRow[];
      setAppsRaw(apps);
      const uniqPositions = Array.from(new Set(apps.map(a => a.position || '').filter(Boolean))) as string[];
      setPositions(uniqPositions);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to load insights';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // Realtime: refresh on application changes for this user
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`insights-apps-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications', filter: `user_id=eq.${user.id}` }, () => {
        fetchApps();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchApps]);

  // Filtered apps
  const appsFiltered = useMemo(() => {
    let list = appsRaw;
    if (timeRange !== 'all') {
      const days = Number(timeRange);
      const start = new Date();
      start.setDate(start.getDate() - days);
      const startStr = formatDate(start);
      list = list.filter(a => !a.applied_date || a.applied_date >= startStr);
    }
    if (positionFilter !== 'all') {
      list = list.filter(a => (a.position || '') === positionFilter);
    }
    return list;
  }, [appsRaw, timeRange, positionFilter]);

  // Compute derived series when filtered apps change
  useEffect(() => {
    const now = new Date();
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 7 * 12);

    const byWeek = new Map<string, { apps: number; offers: number; responseSumDays: number; responseCount: number }>();
    const channelMap = new Map<string, number>();
    const interviewsByWeek = new Map<string, number>();

    for (const row of appsFiltered) {
      if (row.applied_date) {
        const applied = new Date(row.applied_date);
        if (applied >= twelveWeeksAgo) {
          const wk = getWeekStart(applied);
          const cur = byWeek.get(wk) || { apps: 0, offers: 0, responseSumDays: 0, responseCount: 0 };
          cur.apps += 1;
          if (row.offer_date) cur.offers += 1;
          if (row.interview_date) {
            const iv = new Date(row.interview_date);
            const diffDays = Math.max(0, Math.round((iv.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24)));
            cur.responseSumDays += diffDays;
            cur.responseCount += 1;
            const ivWk = getWeekStart(iv);
            interviewsByWeek.set(ivWk, (interviewsByWeek.get(ivWk) || 0) + 1);
          }
          byWeek.set(wk, cur);
        }
      }
      channelMap.set(normalizeChannel(row.url || null), (channelMap.get(normalizeChannel(row.url || null)) || 0) + 1);
    }

    const sr: Array<{ label: string; rate: number }> = [];
    const avg: Array<{ label: string; days: number }> = [];
    const interviewsWeekly: Array<{ label: string; interviews: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(now);
      dt.setDate(now.getDate() - i * 7);
      const wk = getWeekStart(dt);
      const cur = byWeek.get(wk) || { apps: 0, offers: 0, responseSumDays: 0, responseCount: 0 };
      const rate = cur.apps > 0 ? Math.round((cur.offers / cur.apps) * 100) : 0;
      const days = cur.responseCount > 0 ? Math.round(cur.responseSumDays / cur.responseCount) : 0;
      sr.push({ label: wk, rate });
      avg.push({ label: wk, days });
      interviewsWeekly.push({ label: wk, interviews: interviewsByWeek.get(wk) || 0 });
    }
    setSuccessRateSeries(sr);
    setAvgResponseSeries(avg);
    setInterviewsSeries(interviewsWeekly);
    setChannelBars(Array.from(channelMap.entries()).map(([channel, applications]) => ({ channel, applications })).sort((a,b)=>b.applications-a.applications));

    const total = appsFiltered.length;
    const interviews = appsFiltered.filter(a => !!a.interview_date || a.status === 'Interview').length;
    const offers = appsFiltered.filter(a => !!a.offer_date || a.status === 'Offer').length;
    const rejections = appsFiltered.filter(a => !!a.rejected_date || a.status === 'Rejected').length;
    const accepted = appsFiltered.filter(a => (a.offer_date || a.status === 'Offer') && !(a.rejected_date || a.status === 'Rejected')).length;
    const successRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
    setKpi({ total, interviews, offers, accepted, successRate });

    setFunnel([
      { stage: 'Applied', count: total },
      { stage: 'Interview', count: interviews },
      { stage: 'Offer', count: offers },
      { stage: 'Rejections', count: rejections },
    ]);

    const companyCount = new Map<string, number>();
    for (const a of appsFiltered) {
      const key = a.company_name || '—';
      companyCount.set(key, (companyCount.get(key) || 0) + 1);
    }
    setTopCompanies(Array.from(companyCount.entries()).map(([company, applications]) => ({ company, applications })).sort((a,b)=>b.applications-a.applications).slice(0, 7));

    const statusCount = new Map<string, number>();
    for (const a of appsFiltered) {
      const st = a.status || 'Unknown';
      statusCount.set(st, (statusCount.get(st) || 0) + 1);
    }
    setOutcomes(Array.from(statusCount.entries()).map(([name, value]) => ({ name, value })));

    const firstRespMap = new Map<string, { sum: number; n: number }>();
    for (const a of appsFiltered) {
      if (!a.applied_date) continue;
      const applied = new Date(a.applied_date);
      const dates: number[] = [];
      if (a.interview_date) dates.push(new Date(a.interview_date).getTime());
      if (a.offer_date) dates.push(new Date(a.offer_date).getTime());
      if (a.rejected_date) dates.push(new Date(a.rejected_date).getTime());
      if (dates.length === 0) continue;
      const min = Math.min(...dates);
      const days = Math.max(0, Math.round((min - applied.getTime()) / (1000*60*60*24)));
      const key = a.company_name || '—';
      const cur = firstRespMap.get(key) || { sum: 0, n: 0 };
      cur.sum += days; cur.n += 1;
      firstRespMap.set(key, cur);
    }
    setFirstResponseByCompany(Array.from(firstRespMap.entries()).map(([company, v]) => ({ company, days: Math.round(v.sum / v.n) })).sort((a,b)=>a.days-b.days).slice(0, 7));
  }, [appsFiltered, getWeekStart, normalizeChannel]);

  useEffect(() => {
    const daysMap: Record<'7'|'30'|'180'|'all', number> = { '7': 7, '30': 30, '180': 180, 'all': 0 };
    const windowDays = timeRange === 'all' ? 30 : daysMap[timeRange];
    if (windowDays > 0) {
      const end = new Date();
      const start = new Date(); start.setDate(end.getDate() - windowDays);
      const prevEnd = new Date(start); const prevStart = new Date(start); prevStart.setDate(prevStart.getDate() - windowDays);
      const sStr = formatDate(start), eStr = formatDate(end), ps = formatDate(prevStart), pe = formatDate(prevEnd);
      const inRange = (a?: string|null, s?: string, e?: string) => a && a >= s! && a <= e!;
      const cur = appsRaw.filter(a => inRange(a.applied_date, sStr, eStr));
      const prev = appsRaw.filter(a => inRange(a.applied_date, ps, pe));
      const curTotal = cur.length;
      const prevTotal = prev.length || 1;
      const curInterviews = cur.filter(a => inRange(a.interview_date, sStr, eStr)).length;
      const prevInterviews = prev.filter(a => inRange(a.interview_date, ps, pe)).length || 1;
      const curOffers = cur.filter(a => inRange(a.offer_date, sStr, eStr)).length;
      const prevOffers = prev.filter(a => inRange(a.offer_date, ps, pe)).length || 1;
      const curAccepted = cur.filter(a => a.offer_date && !a.rejected_date).length;
      const prevAccepted = prev.filter(a => a.offer_date && !a.rejected_date).length || 1;
      const curSR = curTotal > 0 ? (curAccepted / curTotal) : 0;
      const prevSR = prevTotal > 0 ? (prevAccepted / prevTotal) : 0.0001;
      setKpiTrend({
        total: Math.round(((curTotal - prevTotal) / prevTotal) * 100),
        interviews: Math.round(((curInterviews - prevInterviews) / prevInterviews) * 100),
        offers: Math.round(((curOffers - prevOffers) / prevOffers) * 100),
        successRate: Math.round(((curSR - prevSR) / prevSR) * 100),
      });
    } else {
      setKpiTrend({ total: 0, interviews: 0, offers: 0, successRate: 0 });
    }

    // weekly summary (uses status fallback to applied_date if specific dates are missing)
    const wEnd = new Date(); const wStart = new Date(); wStart.setDate(wEnd.getDate()-7);
    const ws = formatDate(wStart); const we = formatDate(wEnd);
    const inRange = (d?: string|null) => d && d >= ws && d <= we;
    setWeekly({
      apps: appsRaw.filter(a => inRange(a.applied_date)).length,
      interviews: appsRaw.filter(a => inRange(a.interview_date) || (a.status === 'Interview' && inRange(a.applied_date))).length,
      offers: appsRaw.filter(a => inRange(a.offer_date) || (a.status === 'Offer' && inRange(a.applied_date))).length,
      rejections: appsRaw.filter(a => inRange(a.rejected_date) || (a.status === 'Rejected' && inRange(a.applied_date))).length,
    });

    // keep heatDays compute (no UI)
    const base = new Date();
    const year = base.getFullYear(); const month = base.getMonth();
    const first = new Date(year, month, 1);
    const next = new Date(year, month+1, 1);
    const firstStr = formatDate(first); const nextStr = formatDate(next);
    const counts = new Map<string, number>();
    for (const a of appsFiltered) {
      if (a.applied_date && a.applied_date >= firstStr && a.applied_date < nextStr) {
        counts.set(a.applied_date, (counts.get(a.applied_date) || 0) + 1);
      }
    }
    const days: Array<{ date: string; count: number }> = [];
    for (let d = new Date(first); d < next; d.setDate(d.getDate()+1)) {
      const key = formatDate(d);
      days.push({ date: key, count: counts.get(key) || 0 });
    }
    setHeatDays(days);
  }, [appsFiltered, appsRaw, timeRange]);

  const openDrillForWeek = (weekLabel: string) => {
    const rows = appsFiltered.filter(a => a.applied_date && getWeekStart(new Date(a.applied_date)) === weekLabel);
    setDrillTitle(`Applications for week starting ${weekLabel}`);
    setDrillRows(rows);
    setDrillOpen(true);
  };

  const openDrillForFunnel = (stage: string) => {
    let rows: AppRow[] = [];
    if (stage === 'Applied') rows = appsFiltered;
    else if (stage === 'Interview') rows = appsFiltered.filter(a => a.interview_date);
    else if (stage === 'Offer') rows = appsFiltered.filter(a => a.offer_date);
    else if (stage === 'Rejections') rows = appsFiltered.filter(a => a.rejected_date);
    else rows = appsFiltered;
    setDrillTitle(`Drill-down: ${stage}`);
    setDrillRows(rows);
    setDrillOpen(true);
  };

  const hasPayloadLabel = (x: unknown): x is { payload: { label: string } } => {
    return typeof x === 'object' && x !== null && 'payload' in x &&
      typeof (x as { payload?: { label?: unknown } }).payload?.label === 'string';
  };

  const handleFunnelBarClick = (entry: unknown) => {
    if (typeof entry === 'object' && entry !== null && 'stage' in entry) {
      const stage = (entry as { stage?: unknown }).stage;
      if (typeof stage === 'string') {
        openDrillForFunnel(stage);
      }
    }
  };

  const handleSuccessRatePointClick = (_: unknown, props: unknown) => {
    if (hasPayloadLabel(props)) {
      openDrillForWeek(props.payload.label);
    }
  };

  const hasAny = successRateSeries.length > 0 || avgResponseSeries.length > 0 || channelBars.length > 0 || funnel.length > 0 || topCompanies.length > 0 || outcomes.length > 0 || firstResponseByCompany.length > 0;

  return (
    <InsightsContainer>
      <Header>{t('nav.insights')}</Header>

      <FiltersBar>
        <FilterGroup>
          <Label htmlFor="time-range">Time</Label>
          <Select id="time-range" value={timeRange} onChange={(e) => setTimeRange(e.target.value as '7'|'30'|'180'|'all')}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="180">Last 6 months</option>
            <option value="all">All time</option>
          </Select>
        </FilterGroup>
        <FilterGroup>
          <Label htmlFor="position-filter">Position</Label>
          <Select id="position-filter" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
            <option value="all">All</option>
            {positions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </FilterGroup>
      </FiltersBar>

      <Section>
        <InsightCard>
          <CardHeader>Key Metrics</CardHeader>
          <KPIGrid>
            <KPI><KPIValue>{kpi.total}<Trend up={kpiTrend.total>0} flat={kpiTrend.total===0}>{kpiTrend.total===0 ? '—' : (kpiTrend.total>0 ? `↑ ${kpiTrend.total}%` : `↓ ${Math.abs(kpiTrend.total)}%`)}</Trend></KPIValue><KPILabel>Total Applications</KPILabel></KPI>
            <KPI><KPIValue>{kpi.interviews}<Trend up={kpiTrend.interviews>0} flat={kpiTrend.interviews===0}>{kpiTrend.interviews===0 ? '—' : (kpiTrend.interviews>0 ? `↑ ${kpiTrend.interviews}%` : `↓ ${Math.abs(kpiTrend.interviews)}%`)}</Trend></KPIValue><KPILabel>Interviews</KPILabel></KPI>
            <KPI><KPIValue>{kpi.offers}<Trend up={kpiTrend.offers>0} flat={kpiTrend.offers===0}>{kpiTrend.offers===0 ? '—' : (kpiTrend.offers>0 ? `↑ ${kpiTrend.offers}%` : `↓ ${Math.abs(kpiTrend.offers)}%`)}</Trend></KPIValue><KPILabel>Offers</KPILabel></KPI>
            <KPI><KPIValue>{kpi.successRate}%<Trend up={kpiTrend.successRate>0} flat={kpiTrend.successRate===0}>{kpiTrend.successRate===0 ? '—' : (kpiTrend.successRate>0 ? `↑ ${kpiTrend.successRate}%` : `↓ ${Math.abs(kpiTrend.successRate)}%`)}</Trend></KPIValue><KPILabel>Success Rate</KPILabel></KPI>
          </KPIGrid>
        </InsightCard>
      </Section>
      
      <Section>
        <CardsContainer>
          <InsightCard>
            <CardHeader>Application Conversion Funnel</CardHeader>
            {funnel.length > 0 ? (
              <div style={{ width: '100%', minWidth: '280px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnel} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <XAxis dataKey="stage" stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <YAxis stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#151A24', borderColor: '#2D3748', color: '#FFFFFF', fontSize: '12px' }} formatter={(v, n) => [`${v}`, n as string]} />
                    <Bar dataKey="count" fill="#3B82F6" name="Count" onClick={handleFunnelBarClick} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (<div style={{ color: '#B0B8C1' }}>{loading ? 'Loading…' : 'No data yet'}</div>)}
          </InsightCard>

          <InsightCard>
            <CardHeader>Top Companies Applied To</CardHeader>
            {topCompanies.length > 0 ? (
              <div style={{ width: '100%', minWidth: '280px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCompanies} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <XAxis dataKey="company" stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <YAxis stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#151A24', borderColor: '#2D3748', color: '#FFFFFF', fontSize: '12px' }}
                             formatter={(v) => [`${v}`, 'Applications']} />
                    <Bar dataKey="applications" fill="#8B5CF6" name="Applications" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (<div style={{ color: '#B0B8C1' }}>{loading ? 'Loading…' : 'No data yet'}</div>)}
          </InsightCard>

          <InsightCard>
            <CardHeader>Job Application Outcomes</CardHeader>
            {outcomes.length > 0 ? (
              <div style={{ width: '100%', minWidth: '280px', height: '220px', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={outcomes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35} label>
                      {outcomes.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#151A24', borderColor: '#2D3748', color: '#FFFFFF', fontSize: '12px' }}
                             formatter={(v, n) => [`${v}`, n as string]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (<div style={{ color: '#B0B8C1' }}>{loading ? 'Loading…' : 'No data yet'}</div>)}
          </InsightCard>

          <InsightCard>
            <CardHeader>Time to First Response (by Company)</CardHeader>
            {firstResponseByCompany.length > 0 ? (
              <div style={{ width: '100%', minWidth: '280px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={firstResponseByCompany} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <XAxis dataKey="company" stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <YAxis stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#151A24', borderColor: '#2D3748', color: '#FFFFFF', fontSize: '12px' }}
                             formatter={(v) => [`${v} days`, 'Avg Days']} />
                    <Bar dataKey="days" fill="#10B981" name="Days" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (<div style={{ color: '#B0B8C1' }}>{loading ? 'Loading…' : 'No data yet'}</div>)}
          </InsightCard>
        </CardsContainer>
      </Section>

      <Section>
        <CardsContainer>
          <InsightCard>
            <CardHeader>Success Rate Over Time</CardHeader>
            {successRateSeries.length > 0 ? (
              <div style={{ width: '100%', minWidth: '280px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={successRateSeries} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <XAxis dataKey="label" stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <YAxis stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#151A24', borderColor: '#2D3748', color: '#FFFFFF', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Success Rate']} />
                    <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 6, onClick: (...args: unknown[]) => handleSuccessRatePointClick(args[0], args[1]) }} name="Success Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ color: '#B0B8C1' }}>{loading ? 'Loading…' : 'No data yet'}</div>
            )}
          </InsightCard>
          
          <InsightCard>
            <CardHeader>Average Response Time</CardHeader>
            {avgResponseSeries.length > 0 ? (
              <div style={{ width: '100%', minWidth: '280px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={avgResponseSeries} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <XAxis dataKey="label" stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <YAxis stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#151A24', borderColor: '#2D3748', color: '#FFFFFF', fontSize: '12px' }} formatter={(v) => [`${v} days`, 'Avg Response']} />
                    <Line type="monotone" dataKey="days" stroke="#22C55E" strokeWidth={2} activeDot={{ r: 6 }} name="Avg Days" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ color: '#B0B8C1' }}>{loading ? 'Loading…' : 'No data yet'}</div>
            )}
          </InsightCard>
          
          <InsightCard>
            <CardHeader>Interviews Over Time</CardHeader>
            {interviewsSeries.length > 0 ? (
              <div style={{ width: '100%', minWidth: '280px', height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={interviewsSeries} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                    <XAxis dataKey="label" stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <YAxis stroke="#B0B8C1" tick={{ fill: '#B0B8C1', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#151A24', borderColor: '#2D3748', color: '#FFFFFF', fontSize: '12px' }} formatter={(v) => [`${v}`, 'Interviews']} />
                    <Bar dataKey="interviews" fill="#8B5CF6" name="Interviews" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ color: '#B0B8C1' }}>{loading ? 'Loading…' : 'No data yet'}</div>
            )}
          </InsightCard>

          <InsightCard>
            <CardHeader>Weekly Progress</CardHeader>
            <WeeklyGrid>
              <KPI><KPIValue>{weekly.apps}</KPIValue><KPILabel>Applications (7d)</KPILabel></KPI>
              <KPI><KPIValue>{weekly.interviews}</KPIValue><KPILabel>Interviews (7d)</KPILabel></KPI>
              <KPI><KPIValue>{weekly.offers}</KPIValue><KPILabel>Offers (7d)</KPILabel></KPI>
              <KPI><KPIValue>{weekly.rejections}</KPIValue><KPILabel>Rejections (7d)</KPILabel></KPI>
            </WeeklyGrid>
          </InsightCard>
        </CardsContainer>
      </Section>

      {!loading && !hasAny && (
        <EmptyStateContainer>
          <EmptyStateTitle>No insights data available</EmptyStateTitle>
          <EmptyStateText>Insights will be generated as you use the application.</EmptyStateText>
        </EmptyStateContainer>
      )}
      {error && (
        <EmptyStateContainer>
          <EmptyStateTitle>Something went wrong</EmptyStateTitle>
          <EmptyStateText>{error}</EmptyStateText>
        </EmptyStateContainer>
      )}

      {drillOpen && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>{drillTitle}</ModalTitle>
            <List>
              {drillRows.map((r, i) => (
                <ListItem key={i}>
                  <span>{r.company_name || '—'}</span>
                  <span>{r.position || '—'}</span>
                  <span>{r.applied_date || '—'}</span>
                  <span>{r.status || '—'}</span>
                </ListItem>
              ))}
            </List>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
              <button onClick={() => setDrillOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', color: 'inherit', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600 }}>Close</button>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}
    </InsightsContainer>
  );
};

export default Insights;