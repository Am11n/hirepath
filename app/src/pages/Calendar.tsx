import type { FC } from 'react';
import styled from 'styled-components';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../contexts/I18nProvider';

const CalendarContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  overflow-x: hidden;
  
  @media (min-width: 480px) { padding: 1rem; }
  @media (min-width: 768px) { padding: 2rem; }
`;

const Header = styled.h1`
  color: ${p => p.theme.colors.headings};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  @media (min-width: 480px) { font-size: 1.75rem; }
  @media (min-width: 768px) { font-size: 1.875rem; margin-bottom: 2rem; }
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0.75rem;
  @media (min-width: 768px) { margin-bottom: 1rem; }
`;

const RangeLabel = styled.div`
  color: ${p => p.theme.colors.headings};
  font-weight: 700;
  font-size: 1rem;
  margin-right: 0.5rem;
`;

const Button = styled.button`
  background: rgba(255,255,255,0.06);
  color: ${p => p.theme.colors.headings};
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: ${p => p.theme.colors.primary};
  color: white;
  border: none;
`;

const Segmented = styled.div`
  display: inline-flex;
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 8px;
  overflow: hidden;
`;

const SegBtn = styled.button<{ $active?: boolean }>`
  background: ${p => p.$active ? p.theme.colors.primary : 'transparent'};
  color: ${p => p.$active ? '#fff' : p.theme.colors.headings};
  border: none;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
`;

const Card = styled.div`
  background: ${p => p.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  border: 1px solid ${p => p.theme.colors.borders};
  padding: 0.75rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const Cell = styled.div<{ $isToday?: boolean }>`
  background: rgba(255,255,255,0.06);
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 10px;
  min-height: 92px;
  padding: 0.4rem;
  position: relative;
  ${p => p.$isToday ? `box-shadow: 0 0 0 2px ${p.theme.colors.primary} inset;` : ''}
`;

const DayNum = styled.div`
  color: ${p => p.theme.colors.headings};
  font-weight: 700;
  font-size: 0.95rem;
  display: block;
  text-align: center;
`;

const WeekBadge = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  color: ${p => p.theme.colors.headings};
  font-size: 0.55rem;
  opacity: 0.95;
  z-index: 1;
  background: rgba(255,255,255,0.08);
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 4px;
  padding: 0px 3px;
  line-height: 1.1;
`;

const Legend = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const Dot = styled.span<{ color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${p => p.color};
`;

const EventTag = styled.div<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  border: 1px solid ${p => p.theme.colors.borders};
  color: ${p => p.theme.colors.headings};
  font-size: 0.75rem;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalCard = styled.div`
  background: ${p => p.theme.glass.dropdown};
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 12px;
  padding: 1rem;
  width: 90%;
  max-width: 480px;
`;

type CalView = 'month' | 'week' | 'day';

type CalEvent = {
  id: string;
  title: string;
  when: string; // ISO
  kind: 'interview' | 'deadline' | 'followup' | 'overdue';
};

const green = '#22C55E';
const orange = '#F59E0B';
const yellow = '#FACC15';
const red = '#EF4444';

export const Calendar: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [view, setView] = useState<CalView>('month');
  const [anchor, setAnchor] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const monthFmt = useMemo(() => new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }), []);
  const dayFullFmt = useMemo(() => new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }), []);
  const dayShortFmt = useMemo(() => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }), []);

  const monthMatrix = useMemo(() => {
    const d = new Date(anchor);
    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const startIdx = (first.getDay() + 6) % 7; // Mon=0
    const start = new Date(first);
    start.setDate(first.getDate() - startIdx);
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const nd = new Date(start);
      nd.setDate(start.getDate() + i);
      cells.push(nd);
    }
    return cells;
  }, [anchor]);

  const weekDays = useMemo(() => {
    const d = new Date(anchor);
    const day = (d.getDay() + 6) % 7;
    const start = new Date(d);
    start.setDate(d.getDate() - day);
    return Array.from({ length: 7 }, (_, i) => {
      const nd = new Date(start);
      nd.setDate(start.getDate() + i);
      return nd;
    });
  }, [anchor]);

  const currentLabel = useMemo(() => {
    if (view === 'month') return monthFmt.format(anchor);
    if (view === 'week') {
      const s = weekDays[0];
      const e = weekDays[6];
      const sameMonth = s.getMonth() === e.getMonth();
      const sameYear = s.getFullYear() === e.getFullYear();
      const left = sameMonth && sameYear ? `${monthFmt.format(s)} ${s.getDate()}–${e.getDate()}` : `${dayShortFmt.format(s)} – ${dayShortFmt.format(e)}${sameYear ? '' : ' ' + e.getFullYear()}`;
      return left;
    }
    return dayFullFmt.format(anchor);
  }, [view, anchor, weekDays, monthFmt, dayFullFmt, dayShortFmt]);

  const today = () => setAnchor(new Date());
  const prev = () => {
    const d = new Date(anchor);
    if (view === 'month') d.setMonth(d.getMonth() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setAnchor(d);
  };
  const next = () => {
    const d = new Date(anchor);
    if (view === 'month') d.setMonth(d.getMonth() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setAnchor(d);
  };

  // Lookups for linking
  const [apps, setApps] = useState<Array<{ id: string; label: string }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; label: string }>>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const evts: CalEvent[] = [];
    // Interviews from job_applications.interview_date
    const { data: appsData } = await supabase
      .from('job_applications')
      .select('id, company_name, position, interview_date')
      .eq('user_id', user.id);
    if (appsData) {
      setApps(appsData.map(a => ({ id: a.id, label: `${a.company_name} — ${a.position}` })));
      for (const a of appsData) {
        if (a.interview_date) evts.push({ id: a.id + ':i', title: `Interview — ${a.position}`, when: a.interview_date, kind: 'interview' });
      }
    }
    // activities due_date as deadlines/followups
    const { data: acts } = await supabase
      .from('activities')
      .select('id, title, due_date, completed, type')
      .eq('user_id', user.id);
    if (acts) {
      setTasks(acts.map(t => ({ id: t.id, label: t.title || 'Untitled task' })));
      const now = new Date();
      for (const t of acts) {
        if (!t.due_date) continue;
        const when = t.due_date as unknown as string;
        const due = new Date(when);
        if (!t.completed && due < startOfDay(now)) {
          evts.push({ id: t.id + ':o', title: t.title || 'Overdue', when, kind: 'overdue' });
        } else if (['call','email','meeting'].includes(String(t.type))) {
          evts.push({ id: t.id + ':f', title: t.title || 'Follow up', when, kind: 'followup' });
        } else {
          evts.push({ id: t.id + ':d', title: t.title || 'Deadline', when, kind: 'deadline' });
        }
      }
    }
    setEvents(evts);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime sync with Applications and Tasks updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('calendar-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications', filter: `user_id=eq.${user.id}` }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities', filter: `user_id=eq.${user.id}` }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refresh]);

  const eventsOnDay = (d: Date) => {
    const start = startOfDay(d).getTime();
    const end = start + 24 * 60 * 60 * 1000;
    return events.filter(e => {
      const t = new Date(e.when).getTime();
      return t >= start && t < end;
    });
  };

  const colorFor = (k: CalEvent['kind']) => k === 'interview' ? green : k === 'deadline' ? orange : k === 'followup' ? yellow : red;

  // ISO week number helper (Mon-based)
  const getISOWeek = (date: Date): number => {
    const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = tmp.getUTCDay() || 7; // Mon=1..Sun=7
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum); // Thursday of this week
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Add Reminder modal state
  const [open, setOpen] = useState(false);
  const [rTitle, setRTitle] = useState('');
  const [rType, setRType] = useState<'interview' | 'deadline' | 'followup' | 'other'>('followup');
  const [rAppId, setRAppId] = useState<string>('');
  const [rTaskId, setRTaskId] = useState<string>('');
  const [rWhen, setRWhen] = useState<string>('');
  const [rNotes, setRNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [editInterviewId, setEditInterviewId] = useState<string>('');

  const toLocalInput = (iso: string): string => {
    const d = new Date(iso);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };
 
  const openAddReminder = () => {
    const iso = new Date(anchor);
    iso.setMinutes(iso.getMinutes() - iso.getTimezoneOffset());
    setRWhen(iso.toISOString().slice(0,16));
    setRTitle('');
    setRType('followup');
    setRAppId('');
    setRTaskId('');
    setRNotes('');
    setEditInterviewId('');
    setOpen(true);
  };
 
  const saveReminder = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (editInterviewId) {
        const { error } = await supabase
          .from('job_applications')
          .update({ interview_date: rWhen || null, notes: rNotes || null })
          .eq('id', editInterviewId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else if (rTaskId) {
        // Update existing task's due date/notes
        const { error } = await supabase
          .from('activities')
          .update({ due_date: rWhen || null, description: rNotes || null, title: rTitle || null, job_application_id: rAppId || null })
          .eq('id', rTaskId)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const payload: Record<string, unknown> = {
          title: rTitle || 'Reminder',
          type: rType,
          due_date: rWhen || null,
          description: rNotes || null,
          user_id: user.id,
          job_application_id: rAppId || null,
          completed: false,
        };
        const { error } = await supabase.from('activities').insert(payload);
        if (error) throw error;
      }
      setOpen(false);
      await new Promise(r => setTimeout(r, 100));
      await refresh();
    } catch {
      // ignore; could show toast
    } finally {
      setSaving(false);
    }
  };

  // Drag & drop reminders to reschedule (mouse)
  const onDragStart = (e: React.DragEvent<HTMLDivElement>, ev: CalEvent) => {
    e.dataTransfer.setData('text/plain', ev.id);
  };

  const onDropToDay = async (e: React.DragEvent<HTMLDivElement>, day: Date) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id || !user) return;
    const [rawId, suffix] = id.split(':');
    if (!suffix) return; // only our events
    // preserve time component if present on original event
    const source = events.find(x => x.id === id);
    const date = new Date(day);
    if (source) {
      const t = new Date(source.when);
      date.setHours(t.getHours(), t.getMinutes(), 0, 0);
    }
    const iso = new Date(date);
    if (suffix === 'i') {
      // Interview: update job_applications.interview_date
      const { error } = await supabase
        .from('job_applications')
        .update({ interview_date: iso.toISOString() })
        .eq('id', rawId)
        .eq('user_id', user.id);
      if (!error) await refresh();
    } else {
      const { error } = await supabase
        .from('activities')
        .update({ due_date: iso.toISOString() })
        .eq('id', rawId)
        .eq('user_id', user.id);
      if (!error) await refresh();
    }
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const MonthView = () => (
    <Card>
      <Grid>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} style={{ color: '#94A3B8', fontSize: '0.8rem', textAlign: 'center' }}>{d}</div>
        ))}
        {monthMatrix.map((d, i) => {
          const isMonday = ((d.getDay() + 6) % 7) === 0;
          const week = isMonday ? getISOWeek(d) : null;
          return (
            <Cell key={i} $isToday={startOfDay(d).getTime() === startOfDay(new Date()).getTime()} onDragOver={allowDrop} onDrop={(e)=>onDropToDay(e, d)}>
              {isMonday && <WeekBadge>{week}</WeekBadge>}
              <DayNum>{d.getDate()}</DayNum>
              <div style={{ display:'flex', flexDirection:'column', gap: '4px', marginTop: '4px' }}>
                {eventsOnDay(d).slice(0,4).map(ev => (
                  <EventTag
                    key={ev.id}
                    color={colorFor(ev.kind)}
                    draggable
                    onDragStart={(e)=>onDragStart(e, ev)}
                    onClick={(e)=>{ e.stopPropagation(); onEventClick(ev); }}
                    title={ev.title}
                  >
                    <Dot color={colorFor(ev.kind)} />
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.title}</span>
                  </EventTag>
                ))}
                {eventsOnDay(d).length > 4 && (
                  <span style={{ color:'#94A3B8', fontSize:'0.75rem' }}>+{eventsOnDay(d).length - 4} more</span>
                )}
              </div>
            </Cell>
          );
        })}
      </Grid>
    </Card>
  );

  const WeekView = () => (
    <Card>
      <Grid>
        {weekDays.map((d, i) => {
          const isMonday = d.getDay() === 1;
          const week = isMonday ? getISOWeek(d) : null;
          return (
            <Cell key={i} $isToday={startOfDay(d).getTime() === startOfDay(new Date()).getTime()} onDragOver={allowDrop} onDrop={(e)=>onDropToDay(e, d)}>
              {isMonday && <WeekBadge>{week}</WeekBadge>}
              <DayNum>{d.getDate()}</DayNum>
              <div style={{ display:'flex', flexDirection:'column', gap: '6px', marginTop: '6px' }}>
                {eventsOnDay(d).map(ev => (
                  <EventTag key={ev.id} color={colorFor(ev.kind)} draggable onDragStart={(e)=>onDragStart(e, ev)} onClick={(e)=>{ e.stopPropagation(); onEventClick(ev); }}>
                    <Dot color={colorFor(ev.kind)} />
                    <span>{ev.title}</span>
                  </EventTag>
                ))}
              </div>
            </Cell>
          );
        })}
      </Grid>
    </Card>
  );

  const DayView = () => (
    <Card>
      <div style={{ display:'flex', flexDirection:'column', gap: '8px' }}>
        {eventsOnDay(anchor).map(ev => (
          <EventTag key={ev.id} color={colorFor(ev.kind)} draggable onDragStart={(e)=>onDragStart(e, ev)} onClick={(e)=>{ e.stopPropagation(); onEventClick(ev); }}>
            <Dot color={colorFor(ev.kind)} />
            <span>{ev.title}</span>
            <span style={{ color:'#94A3B8' }}>{new Date(ev.when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </EventTag>
        ))}
        {eventsOnDay(anchor).length === 0 && (
          <span style={{ color:'#94A3B8' }}>No events.</span>
        )}
      </div>
    </Card>
  );

  const [viewEvent, setViewEvent] = useState<CalEvent | null>(null);
  const [viewDetails, setViewDetails] = useState<{ nextAction?: { title: string; when?: string } | null; app?: { id: string; label: string } | null; notes?: string | null } | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const onEventClick = (ev: CalEvent) => {
    setViewEvent(ev);
    setDetailsLoading(true);
    setViewDetails(null);
    (async () => {
      if (!user) return;
      const [rawId, suffix] = ev.id.split(':');
      try {
        if (suffix === 'i') {
          // Interview: fetch app + next action + notes
          const { data: app } = await supabase
            .from('job_applications')
            .select('id, company_name, position, notes')
            .eq('id', rawId)
            .eq('user_id', user.id)
            .maybeSingle();
          let nextAction: { title: string; when?: string } | null = null;
          const { data: na } = await supabase
            .from('activities')
            .select('title, due_date')
            .eq('user_id', user.id)
            .eq('job_application_id', rawId)
            .eq('completed', false)
            .order('due_date', { ascending: true, nullsFirst: false })
            .limit(1);
          if (na && na.length > 0) nextAction = { title: na[0].title || 'Next action', when: na[0].due_date as unknown as string | undefined };
          setViewDetails({
            app: app ? { id: app.id as string, label: `${app.company_name} — ${app.position}` } : null,
            nextAction,
            notes: app && (app as any).notes ? String((app as any).notes) : null,
          });
        } else {
          // Activity: fetch itself + linked app
          const { data: act } = await supabase
            .from('activities')
            .select('id, title, due_date, description, job_application_id')
            .eq('id', rawId)
            .eq('user_id', user.id)
            .maybeSingle();
          let appInfo: { id: string; label: string } | null = null;
          let appNotes: string | null = null;
          if (act?.job_application_id) {
            const { data: app } = await supabase
              .from('job_applications')
              .select('id, company_name, position, notes')
              .eq('id', act.job_application_id as string)
              .eq('user_id', user.id)
              .maybeSingle();
            if (app) appInfo = { id: app.id as string, label: `${app.company_name} — ${app.position}` };
            if (app && (app as any).notes) appNotes = String((app as any).notes);
          }
          setViewDetails({
            app: appInfo,
            nextAction: { title: act?.title || 'Reminder', when: act?.due_date as unknown as string | undefined },
            notes: act?.description ? String(act.description) : (appNotes || null),
          });
        }
      } finally {
        setDetailsLoading(false);
      }
    })();
  };

  return (
    <CalendarContainer>
      <Header>{t('calendar.title')}</Header>
      <Legend>
        <EventTag color={green}><Dot color={green} /> {t('calendar.legend.interviews')}</EventTag>
        <EventTag color={orange}><Dot color={orange} /> {t('calendar.legend.deadlines')}</EventTag>
        <EventTag color={yellow}><Dot color={yellow} /> {t('calendar.legend.todo')}</EventTag>
        <EventTag color={red}><Dot color={red} /> {t('calendar.legend.overdue')}</EventTag>
      </Legend>
      <Controls>
        <RangeLabel aria-live="polite">{currentLabel}</RangeLabel>
        <Button onClick={prev}>{view === 'month' ? t('calendar.prev.month') : view === 'week' ? t('calendar.prev.week') : t('calendar.prev.day')}</Button>
        <PrimaryButton onClick={today}>{t('calendar.today')}</PrimaryButton>
        <Button onClick={next}>{view === 'month' ? t('calendar.next.month') : view === 'week' ? t('calendar.next.week') : t('calendar.next.day')}</Button>
        <div style={{ flex: 1 }} />
        <Button onClick={openAddReminder}>{t('calendar.addReminder')}</Button>
        <Segmented>
          <SegBtn $active={view==='month'} onClick={() => setView('month')}>{t('calendar.view.month')}</SegBtn>
          <SegBtn $active={view==='week'} onClick={() => setView('week')}>{t('calendar.view.week')}</SegBtn>
          <SegBtn $active={view==='day'} onClick={() => setView('day')}>{t('calendar.view.day')}</SegBtn>
        </Segmented>
      </Controls>
      {view === 'month' && <MonthView />}
      {view === 'week' && <WeekView />}
      {view === 'day' && <DayView />}

      {open && (
        <ModalBackdrop onClick={()=>setOpen(false)}>
          <ModalCard onClick={(e)=>e.stopPropagation()}>
            <h3 style={{ marginTop:0, color:'inherit' }}>{t('calendar.modal.addTitle')}</h3>
            <div style={{ display:'grid', gap:'0.5rem' }}>
              <label style={{ color:'inherit', fontSize:'0.9rem' }}>{t('calendar.details.title')}
                <input value={rTitle} onChange={e=>setRTitle(e.target.value)} placeholder="Follow up with Company" style={{ width:'100%', padding:'0.5rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }} />
              </label>
              <label style={{ color:'inherit', fontSize:'0.9rem' }}>{t('calendar.modal.type')}
                <select value={rType} onChange={e=>setRType(e.target.value as any)} style={{ width:'100%', padding:'0.5rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }}>
                  <option value="interview">{t('calendar.modal.type.interview')}</option>
                  <option value="deadline">{t('calendar.modal.type.deadline')}</option>
                  <option value="followup">{t('calendar.modal.type.todo')}</option>
                  <option value="other">{t('calendar.modal.type.other')}</option>
                </select>
              </label>
              <label style={{ color:'inherit', fontSize:'0.9rem' }}>{t('calendar.modal.linkApp')}
                <select value={rAppId} onChange={e=>setRAppId(e.target.value)} style={{ width:'100%', padding:'0.5rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }}>
                  <option value="">None</option>
                  {apps.map(a => (<option key={a.id} value={a.id}>{a.label}</option>))}
                </select>
              </label>
              <label style={{ color:'inherit', fontSize:'0.9rem' }}>{t('calendar.modal.updateTask')}
                <select value={rTaskId} onChange={e=>setRTaskId(e.target.value)} style={{ width:'100%', padding:'0.5rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }}>
                  <option value="">None</option>
                  {tasks.map(tk => (<option key={tk.id} value={tk.id}>{tk.label}</option>))}
                </select>
              </label>
              <label style={{ color:'inherit', fontSize:'0.9rem' }}>{t('calendar.modal.when')}
                <input type="datetime-local" value={rWhen} onChange={e=>setRWhen(e.target.value)} style={{ width:'100%', padding:'0.5rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }} />
              </label>
              <label style={{ color:'inherit', fontSize:'0.9rem' }}>{t('calendar.modal.notes')}
                <textarea value={rNotes} onChange={e=>setRNotes(e.target.value)} rows={3} style={{ width:'100%', padding:'0.5rem', borderRadius:8, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }} />
              </label>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem', marginTop:'0.75rem' }}>
              <button onClick={()=>setOpen(false)} style={{ background:'rgba(255,255,255,0.06)', color:'inherit', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, padding:'0.5rem 0.9rem' }}>{t('calendar.modal.cancel')}</button>
              <button onClick={saveReminder} disabled={saving} style={{ background:'var(--primary, #2563EB)', color:'#fff', border:'none', borderRadius:8, padding:'0.5rem 0.9rem' }}>{saving ? 'Saving…' : t('calendar.modal.save')}</button>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}

      {viewEvent && (
        <ModalBackdrop onClick={()=>setViewEvent(null)}>
          <ModalCard onClick={(e)=>e.stopPropagation()}>
            <h3 style={{ marginTop:0, color:'inherit' }}>{t('calendar.details.title')} — {t('calendar.title')}</h3>
            <div style={{ display:'grid', gap:'0.5rem' }}>
              <div style={{ color:'#94A3B8', fontSize:'0.85rem' }}>{t('calendar.details.type')}</div>
              <div>{viewEvent.kind === 'interview' ? 'Interview' : viewEvent.kind === 'deadline' ? 'Deadline' : viewEvent.kind === 'followup' ? 'To do' : 'Overdue'}</div>
              <div style={{ color:'#94A3B8', fontSize:'0.85rem' }}>{t('calendar.details.title')}</div>
              <div>{viewEvent.title}</div>
              <div style={{ color:'#94A3B8', fontSize:'0.85rem' }}>{t('calendar.details.when')}</div>
              <div>{new Date(viewEvent.when).toLocaleString()}</div>
              <div style={{ color:'#94A3B8', fontSize:'0.85rem' }}>{t('calendar.details.next')}</div>
              <div>{detailsLoading ? 'Loading…' : (viewDetails?.nextAction ? `${viewDetails.nextAction.title}${viewDetails.nextAction.when ? ' — ' + new Date(viewDetails.nextAction.when).toLocaleDateString() : ''}` : '-')}</div>
              <div style={{ color:'#94A3B8', fontSize:'0.85rem' }}>{t('calendar.details.app')}</div>
              <div>
                {detailsLoading ? 'Loading…' : (viewDetails?.app ? (
                  <a href="#" onClick={(e)=>{ e.preventDefault(); setViewEvent(null); navigate('/applications?appId='+viewDetails.app!.id); }} style={{ color: 'inherit', textDecoration: 'underline' }}>{viewDetails.app.label}</a>
                ) : '-')}
              </div>
              <div style={{ color:'#94A3B8', fontSize:'0.85rem' }}>{t('calendar.details.notes')}</div>
              <div style={{ whiteSpace:'pre-wrap' }}>{detailsLoading ? 'Loading…' : (viewDetails?.notes || '-')}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'0.5rem', marginTop:'0.75rem' }}>
              <button onClick={()=>setViewEvent(null)} style={{ background:'rgba(255,255,255,0.06)', color:'inherit', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, padding:'0.5rem 0.9rem' }}>{t('calendar.details.close')}</button>
              <button onClick={()=>{
                if (!user || !viewEvent) return;
                const [rawId, suffix] = viewEvent.id.split(':');
                if (suffix === 'i') {
                  setEditInterviewId(rawId);
                  setRType('interview');
                  setRAppId(rawId);
                  setRTaskId('');
                  setRNotes(viewDetails?.notes || '');
                } else {
                  setEditInterviewId('');
                  setRType(viewEvent.kind === 'deadline' ? 'deadline' : 'followup');
                  setRTaskId(rawId);
                  setRAppId(viewDetails?.app?.id || '');
                  setRNotes(viewDetails?.notes || '');
                }
                setRTitle(viewEvent.title);
                setRWhen(toLocalInput(viewEvent.when));
                setOpen(true);
                setViewEvent(null);
              }} style={{ background:'var(--primary, #2563EB)', color:'#fff', border:'none', borderRadius:8, padding:'0.5rem 0.9rem' }}>{t('calendar.details.edit')}</button>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}
    </CalendarContainer>
  );
};

export default Calendar; 