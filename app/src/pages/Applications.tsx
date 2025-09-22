import type { FC } from 'react';
import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const ApplicationsContainer = styled.div`
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

const FiltersContainer = styled.div`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const FilterHeader = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 100%;
  
  @media (min-width: 480px) {
    min-width: 200px;
  }
  
  @media (min-width: 768px) {
    min-width: 150px;
  }
`;

const FilterLabel = styled.label`
  display: block;
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.9rem;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (min-width: 480px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

const TableContainer = styled.div`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
  }
  
  @media (min-width: 768px) {
    font-size: 0.95rem;
  }
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${props => props.theme.colors.borders};
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.75rem 0.5rem;
  color: ${props => props.theme.colors.bodyText};
  font-weight: 600;
  font-size: 0.75rem;
  vertical-align: middle;
  
  @media (min-width: 480px) {
    padding: 0.875rem 0.75rem;
    font-size: 0.8rem;
  }
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
  
  &:last-child {
    text-align: right;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 0.5rem;
  color: ${props => props.theme.colors.headings};
  font-size: 0.8rem;
  vertical-align: middle;
  
  @media (min-width: 480px) {
    padding: 0.875rem 0.75rem;
    font-size: 0.875rem;
  }
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 0.95rem;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
  
  @media (min-width: 480px) {
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
  }
  
  background: ${props => {
    switch (props.status) {
      case 'Applied': return 'rgba(59, 130, 246, 0.2)';
      case 'Interview': return 'rgba(139, 92, 246, 0.2)';
      case 'Offer': return 'rgba(16, 185, 129, 0.2)';
      case 'Rejected': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(148, 163, 184, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Applied': return '#3B82F6';
      case 'Interview': return '#8B5CF6';
      case 'Offer': return '#10B981';
      case 'Rejected': return '#EF4444';
      default: return '#94A3B8';
    }
  }};
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
  margin-bottom: 0.5rem;
  
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

const CreateButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (min-width: 480px) {
    width: auto;
    padding: 0.7rem 1.4rem;
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 10px;
  }
`;

// Always-visible create button variant for header
const CreateButtonInline = styled(CreateButton)`
  width: auto;
`;

// Top bar with page title and action
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

// Create Modal
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
  max-width: 520px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
`;

const ModalTitle = styled.h3`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

const ModalRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem 1rem;
  }
`;

const Label = styled.label`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
`;

const Input = styled.input`
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.9rem;
  width: 100%;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SecondaryButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
`;

const RowActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const EditButton = styled(SecondaryButton)`
  padding: 0.4rem 0.8rem;
`;


type ApplicationRow = {
  id: string;
  company_name: string;
  position: string;
  applied_date: string | null;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | string;
};

export const Applications: FC = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Create modal state
  const [showCreate, setShowCreate] = useState(false);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [appliedDate, setAppliedDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [eCompany, setECompany] = useState('');
  const [ePosition, setEPosition] = useState('');
  const [eStatus, setEStatus] = useState<'Applied' | 'Interview' | 'Offer' | 'Rejected' | ''>('');
  const [eAppliedDate, setEAppliedDate] = useState<string>('');
  const [eInterviewDate, setEInterviewDate] = useState<string>('');
  const [eOfferDate, setEOfferDate] = useState<string>('');
  const [eRejectedDate, setERejectedDate] = useState<string>('');
  const [eUrl, setEUrl] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveErrorEdit, setSaveErrorEdit] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '7' | '30' | '90'>('all');
  const [companies, setCompanies] = useState<string[]>([]);

  const formatDate = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper to format ISO date to input[type="datetime-local"] value in local time
  const toLocalDateTimeInput = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    let query = supabase
      .from('job_applications')
      .select('id, company_name, position, applied_date, status')
      .eq('user_id', user.id);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    if (companyFilter !== 'all') {
      query = query.eq('company_name', companyFilter);
    }
    if (dateRangeFilter !== 'all') {
      const days = Number(dateRangeFilter);
      const start = new Date();
      start.setDate(start.getDate() - days);
      query = query.gte('applied_date', formatDate(start));
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows((data || []) as ApplicationRow[]);
    }
    setLoading(false);
  }, [user, statusFilter, companyFilter, dateRangeFilter]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!user) return;
      // Load companies for filter options
      const { data: allCompanies } = await supabase
        .from('job_applications')
        .select('company_name')
        .eq('user_id', user.id);
      if (isMounted && allCompanies) {
        const unique = Array.from(new Set((allCompanies || []).map(r => r.company_name).filter(Boolean))).sort();
        setCompanies(unique as string[]);
      }
      await refresh();
      if (!isMounted) return;
    };
    fetchData();
    return () => { isMounted = false };
  }, [user, refresh]);

  const handleOpenCreate = () => {
    setCompany('');
    setPosition('');
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setAppliedDate(`${yyyy}-${mm}-${dd}`);
    setUrl('');
    setSaveError(null);
    setShowCreate(true);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!company.trim() || !position.trim()) {
      setSaveError('Company and Position are required');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const insert = {
        user_id: user.id,
        company_name: company.trim(),
        position: position.trim(),
        status: 'Applied',
        applied_date: appliedDate || null,
        url: url.trim() || null,
      };
      const { error: insertErr } = await supabase.from('job_applications').insert(insert);
      if (insertErr) throw insertErr;
      setShowCreate(false);
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to create application';
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (row: ApplicationRow) => {
    setEditId(row.id);
    setECompany(row.company_name);
    setEPosition(row.position);
    const s = row.status;
    setEStatus(s === 'Applied' || s === 'Interview' || s === 'Offer' || s === 'Rejected' ? (s as 'Applied' | 'Interview' | 'Offer' | 'Rejected') : 'Applied');
    setEAppliedDate(row.applied_date ?? '');
    setEInterviewDate(toLocalDateTimeInput((row as any).interview_date as string | null));
    setEOfferDate('');
    setERejectedDate('');
    setEUrl('');
    setSaveErrorEdit(null);
    setShowEdit(true);
  };

  const handleUpdate = async () => {
    if (!user || !editId) return;
    if (!eCompany.trim() || !ePosition.trim()) {
      setSaveErrorEdit('Company and Position are required');
      return;
    }
    setSavingEdit(true);
    setSaveErrorEdit(null);
    try {
      const update: Record<string, unknown> = {
        company_name: eCompany.trim(),
        position: ePosition.trim(),
        status: eStatus || 'Applied',
        applied_date: eAppliedDate || null,
        url: eUrl.trim() || null,
      };
      if (eInterviewDate) update.interview_date = new Date(eInterviewDate).toISOString();
      if (eOfferDate) update.offer_date = eOfferDate;
      if (eRejectedDate) update.rejected_date = eRejectedDate;

      const { error: updErr } = await supabase
        .from('job_applications')
        .update(update)
        .eq('id', editId)
        .eq('user_id', user.id);
      if (updErr) throw updErr;
      setShowEdit(false);
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update application';
      setSaveErrorEdit(message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <ApplicationsContainer>
      <TopBar>
        <Header>Applications</Header>
        <CreateButtonInline onClick={handleOpenCreate}>Create Application</CreateButtonInline>
      </TopBar>
      <FiltersContainer>
        <FilterHeader>Filters</FilterHeader>
        <FilterOptions>
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Applied' | 'Interview' | 'Offer' | 'Rejected')}>
              <option value="all">All Statuses</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Company</FilterLabel>
            <FilterSelect value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              <option value="all">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterLabel>Date Range</FilterLabel>
            <FilterSelect value={dateRangeFilter} onChange={(e) => setDateRangeFilter(e.target.value as 'all' | '7' | '30' | '90')}>
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </FilterSelect>
          </FilterGroup>
        </FilterOptions>
      </FiltersContainer>

      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Company</TableHeader>
              <TableHeader>Position</TableHeader>
              <TableHeader>Date Applied</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {loading && (
              <tr><TableCell colSpan={5}>Loading…</TableCell></tr>
            )}
            {error && !loading && (
              <tr><TableCell colSpan={5} style={{ color: '#f87171' }}>Error: {error}</TableCell></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr><TableCell colSpan={5}>No applications yet.</TableCell></tr>
            )}
            {!loading && !error && rows.map(app => (
              <TableRow key={app.id}>
                <TableCell>{app.company_name}</TableCell>
                <TableCell>{app.position}</TableCell>
                <TableCell>{app.applied_date ?? '-'}</TableCell>
                <TableCell>
                  <StatusBadge status={app.status}>{app.status}</StatusBadge>
                </TableCell>
                <TableCell>
                  <RowActions>
                    <EditButton type="button" onClick={() => handleOpenEdit(app)}>Edit</EditButton>
                  </RowActions>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {(!loading && !error && rows.length === 0) && (
        <EmptyStateContainer>
          <EmptyStateTitle>No applications found</EmptyStateTitle>
          <EmptyStateText>Create a new application to add to your list.</EmptyStateText>
          <CreateButton onClick={handleOpenCreate}>Create Application</CreateButton>
        </EmptyStateContainer>
      )}

      {showCreate && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Create Application</ModalTitle>
            <ModalRow>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" placeholder="Job title" value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
            </ModalRow>
            <ModalRow>
              <div>
                <Label htmlFor="applied">Applied Date</Label>
                <Input id="applied" type="date" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="url">Job URL (optional)</Label>
                <Input id="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
            </ModalRow>
            {saveError && <div style={{ color: '#f87171', marginTop: '0.25rem' }}>{saveError}</div>}
            <ModalActions>
              <SecondaryButton type="button" onClick={() => setShowCreate(false)} disabled={saving}>Cancel</SecondaryButton>
              <PrimaryButton type="button" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}

      {showEdit && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Edit Application</ModalTitle>
            <ModalRow>
              <div>
                <Label htmlFor="e-company">Company</Label>
                <Input id="e-company" placeholder="Company name" value={eCompany} onChange={(e) => setECompany(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="e-position">Position</Label>
                <Input id="e-position" placeholder="Job title" value={ePosition} onChange={(e) => setEPosition(e.target.value)} />
              </div>
            </ModalRow>
            <ModalRow>
              <div>
                <Label htmlFor="e-status">Status</Label>
                <FilterSelect id="e-status" value={eStatus || 'Applied'} onChange={(e) => setEStatus(e.target.value as 'Applied' | 'Interview' | 'Offer' | 'Rejected')}>
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </FilterSelect>
              </div>
              <div>
                <Label htmlFor="e-applied">Applied Date</Label>
                <Input id="e-applied" type="date" value={eAppliedDate} onChange={(e) => setEAppliedDate(e.target.value)} />
              </div>
            </ModalRow>
            <ModalRow>
              <div>
                <Label htmlFor="e-interview">Interview Date & Time (optional)</Label>
                <Input id="e-interview" type="datetime-local" value={eInterviewDate} onChange={(e) => setEInterviewDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="e-offer">Offer Date (optional)</Label>
                <Input id="e-offer" type="date" value={eOfferDate} onChange={(e) => setEOfferDate(e.target.value)} />
              </div>
            </ModalRow>
            <ModalRow>
              <div>
                <Label htmlFor="e-rejected">Rejected Date (optional)</Label>
                <Input id="e-rejected" type="date" value={eRejectedDate} onChange={(e) => setERejectedDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="e-url">Job URL (optional)</Label>
                <Input id="e-url" placeholder="https://..." value={eUrl} onChange={(e) => setEUrl(e.target.value)} />
              </div>
            </ModalRow>
            {saveErrorEdit && <div style={{ color: '#f87171', marginTop: '0.25rem' }}>{saveErrorEdit}</div>}
            <ModalActions>
              <SecondaryButton type="button" onClick={() => setShowEdit(false)} disabled={savingEdit}>Cancel</SecondaryButton>
              <PrimaryButton type="button" onClick={handleUpdate} disabled={savingEdit}>{savingEdit ? 'Saving…' : 'Save Changes'}</PrimaryButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}
    </ApplicationsContainer>
  );
};

export default Applications;