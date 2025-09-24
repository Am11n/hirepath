import type { FC } from 'react';
import styled from 'styled-components';
import { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nProvider';

// Add a shared Status type
type Status = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

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
  
  &:last-child {
    text-align: right;
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

const EditButton = styled(SecondaryButton)`
  padding: 0.4rem 0.8rem;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
  background: ${p => p.$active ? p.theme.colors.primary : 'rgba(255,255,255,0.06)'};
  color: ${p => p.$active ? '#fff' : p.theme.colors.headings};
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  cursor: pointer;
`;

const Kanban = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
`;

const Column = styled.div<{ $variant?: 'applied' | 'interview' | 'offer' | 'rejected' }>`
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 12px;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.borders};
  background: ${props => {
    const v = props.$variant || 'applied';
    const bg = v === 'applied'
      ? 'rgba(139, 92, 246, 0.22)'
      : v === 'interview'
        ? 'rgba(245, 158, 11, 0.22)'
        : v === 'offer'
          ? 'rgba(16, 185, 129, 0.22)'
          : 'rgba(239, 68, 68, 0.22)';
    return `linear-gradient(to bottom right, ${bg}, rgba(255,255,255,0.07))`;
  }};
`;

const ColumnHeader = styled.h3`
  color: ${props => props.theme.colors.headings};
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const Card = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 10px;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  cursor: grab;
  position: relative;
  touch-action: none; /* prevent browser scroll/pinch during touch drag */
`;

const DragGhost = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;
  background: rgba(255,255,255,0.12);
  border: 1px dashed ${p => p.theme.colors.borders};
  color: ${p => p.theme.colors.headings};
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 0.85rem;
  z-index: 1000;
`;

const CardDeleteBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid ${p => p.theme.colors.borders};
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SmallSelectInline = styled.select`
  background: rgba(255,255,255,0.06);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
`;

const StatusDot = styled.span<{ status: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  margin-right: 6px;
  background: ${p => {
    switch (p.status) {
      case 'Applied': return '#8B5CF6';
      case 'Interview': return '#F59E0B';
      case 'Offer': return '#10B981';
      case 'Rejected': return '#EF4444';
      default: return '#94A3B8';
    }
  }};
`;

const ColumnHeaderRight = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AddMini = styled.button`
  background: rgba(255,255,255,0.08);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
`;

const KebabButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ActionMenu = styled.div`
  position: absolute;
  top: 0;
  bottom: 0; /* match row height */
  right: 36px; /* open to the left of the kebab button (28px + gap) */
  background: ${props => props.theme.glass.dropdown};
  backdrop-filter: saturate(120%) blur(6px);
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  min-width: 160px;
  padding: 0.25rem;
  z-index: 20;
  display: flex;
  align-items: center; /* center items vertically within row height */
`;

const ActionItem = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  color: ${props => props.theme.colors.headings};
  border: none;
  border-radius: 6px;
  padding: 0.45rem 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.06); }
`;

const Relative = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center; /* ensure button aligns to row center */
`;

const SmallInputInline = styled.input`
  background: rgba(255,255,255,0.06);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
  width: 100%;
`;

// New: clickable status pill styled as the existing badge
const StatusPill = styled.button<{ status: Status }>`
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid ${props => props.theme.colors.borders};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${props => {
    switch (props.status) {
      case 'Applied': return 'rgba(139, 92, 246, 0.2)';
      case 'Interview': return 'rgba(245, 158, 11, 0.2)';
      case 'Offer': return 'rgba(16, 185, 129, 0.2)';
      case 'Rejected': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(148, 163, 184, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Applied': return '#8B5CF6';
      case 'Interview': return '#F59E0B';
      case 'Offer': return '#10B981';
      case 'Rejected': return '#EF4444';
      default: return '#94A3B8';
    }
  }};
`;

const StatusMenu = styled.div`
  position: absolute;
  top: 28px;
  left: 0;
  background: ${props => props.theme.glass.dropdown};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.25rem;
  min-width: 140px;
  z-index: 20;
`;

const StatusMenuItem = styled.button<{ status: Status }>`
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  padding: 0.35rem 0.5rem;
  color: ${props => props.theme.colors.headings};
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover { background: rgba(255,255,255,0.06); }
`;

const DangerButton = styled(SecondaryButton)`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const BulkBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  margin: 0 0 0.75rem 0;
`;


type ActivityRow = {
  job_application_id: string | null;
  title: string | null;
  due_date: string | null;
  completed: boolean | null;
};

// Include optional status date fields so we don't need any-casts later
type ApplicationRow = {
  id: string;
  company_name: string;
  position: string;
  applied_date: string | null;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | string;
  interview_date?: string | null;
  offer_date?: string | null;
  rejected_date?: string | null;
  notes?: string | null;
  url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
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
  const [createStatus, setCreateStatus] = useState<'Applied' | 'Interview' | 'Offer' | 'Rejected'>('Applied');

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [eCompany, setECompany] = useState('');
  const [ePosition, setEPosition] = useState('');
  const [eStatus, setEStatus] = useState<'Applied' | 'Interview' | 'Offer' | 'Rejected' | ''>('');
  const [eAppliedDate, setEAppliedDate] = useState<string>('');
  const [eStatusDate, setEStatusDate] = useState<string>('');
  const [eUrl, setEUrl] = useState('');
  const [eNotes, setENotes] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveErrorEdit, setSaveErrorEdit] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | '7' | '30' | '90'>('all');
  const [companies, setCompanies] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  // sorting
  const [sortField, setSortField] = useState<'applied_date' | 'company_name' | 'status'>('applied_date');
  const [sortDir] = useState<'asc' | 'desc'>('desc');
  // next action map
  const [nextActionByApp, setNextActionByApp] = useState<Record<string, { title: string; due: string | null }>>({});
  // view (persist across reloads)
  const [view, setView] = useState<'list' | 'kanban'>(() => {
    const v = localStorage.getItem('applications:view');
    return v === 'kanban' ? 'kanban' : 'list';
  });
  // Preview modal (non-edit)
  const [showPreview, setShowPreview] = useState(false);
  const [previewApp, setPreviewApp] = useState<ApplicationRow | null>(null);
  const openPreview = (row: ApplicationRow) => { setPreviewApp(row); setShowPreview(true); };
  useEffect(() => {
    localStorage.setItem('applications:view', view);
  }, [view]);

  // selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allVisibleSelected = rows.length > 0 && rows.every(r => selectedIds.has(r.id));
  const toggleAllVisible = () => {
    setSelectedIds(prev => {
      const next = new Set<string>(prev);
      if (rows.length === 0) return next;
      if (rows.every(r => next.has(r.id))) {
        rows.forEach(r => next.delete(r.id));
      } else {
        rows.forEach(r => next.add(r.id));
      }
      return next;
    });
  };
  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set<string>(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const [bulkStatus, setBulkStatus] = useState<Status>('Applied');
  const bulkUpdateStatus = async () => {
    if (!user || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    await supabase.from('job_applications').update({ status: bulkStatus }).in('id', ids).eq('user_id', user.id);
    setSelectedIds(new Set());
    await refresh();
  };
  const bulkDelete = async () => {
    if (!user || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    await supabase.from('job_applications').delete().in('id', ids).eq('user_id', user.id);
    setSelectedIds(new Set());
    await refresh();
  };

  const formatDate = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    let query = supabase
      .from('job_applications')
      .select('id, company_name, position, applied_date, status, interview_date, offer_date, rejected_date, notes, url, created_at, updated_at')
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
    // sorting
    query = query.order(sortField, { ascending: sortDir === 'asc' });

    const [{ data, error: err }, companiesRes, actsRes] = await Promise.all([
      query,
      supabase.from('job_applications').select('company_name').eq('user_id', user.id),
      supabase.from('activities').select('job_application_id, title, due_date, completed').eq('user_id', user.id).eq('completed', false)
    ]);
    if (err) {
      setError(err.message); setRows([]); setLoading(false); return;
    }
    setRows((data || []) as ApplicationRow[]);
    const comps = Array.from(new Set((companiesRes.data || []).map(r => r.company_name).filter(Boolean)));
    setCompanies(comps);
    // build next action map
    const map: Record<string, { title: string; due: string | null }> = {};
    (actsRes.data as ActivityRow[] | null || []).forEach((a) => {
      const key = a.job_application_id; if (!key) return;
      const prev = map[key];
      const due = a.due_date || null;
      if (!prev) map[key] = { title: a.title || 'Follow up', due };
      else {
        const prevDue = prev.due ? new Date(prev.due).getTime() : Number.POSITIVE_INFINITY;
        const curDue = due ? new Date(due).getTime() : Number.POSITIVE_INFINITY;
        if (curDue < prevDue) map[key] = { title: a.title || 'Follow up', due };
      }
    });
    setNextActionByApp(map);
    setLoading(false);
  }, [user, statusFilter, companyFilter, dateRangeFilter, sortField, sortDir]);

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

  const handleOpenCreateWithStatus = (status: 'Applied' | 'Interview' | 'Offer' | 'Rejected') => {
    setCompany('');
    setPosition('');
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setAppliedDate(`${yyyy}-${mm}-${dd}`);
    setUrl('');
    setSaveError(null);
    setCreateStatus(status);
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
        status: createStatus,
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
    if (s === 'Interview') setEStatusDate(toLocalDateInput(row.interview_date ?? null));
    else if (s === 'Offer') setEStatusDate(toLocalDateInput(row.offer_date ?? null));
    else if (s === 'Rejected') setEStatusDate(toLocalDateInput(row.rejected_date ?? null));
    else setEStatusDate('');
    setEUrl(row.url || '');
    setENotes(row.notes || '');
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
        notes: eNotes.trim() ? eNotes.trim() : null,
      };
      update.interview_date = null;
      update.offer_date = null;
      update.rejected_date = null;
      if (eStatus === 'Interview') update.interview_date = eStatusDate || null;
      else if (eStatus === 'Offer') update.offer_date = eStatusDate || null;
      else if (eStatus === 'Rejected') update.rejected_date = eStatusDate || null;
      // Applied has no status date

      const { error: updErr } = await supabase
        .from('job_applications')
        .update(update)
        .eq('id', editId)
        .eq('user_id', user.id);
      if (updErr) throw updErr;
      setShowEdit(false);
      await new Promise(res => setTimeout(res, 100));
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update application';
      setSaveErrorEdit(message);
    } finally {
      setSavingEdit(false);
    }
  };

  // helper to filter by status
  const byStatus = (status: 'Applied' | 'Interview' | 'Offer' | 'Rejected') =>
    rows.filter(r => r.status === status);

  const handleCardDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleColumnDrop = async (e: React.DragEvent<HTMLDivElement>, toStatus: 'Applied' | 'Interview' | 'Offer' | 'Rejected') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id || !user) return;
    await supabase
      .from('job_applications')
      .update({ status: toStatus })
      .eq('id', id)
      .eq('user_id', user.id);
    await refresh();
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // Touch DnD support (mobile/tablet)
  const [touchDragAppId, setTouchDragAppId] = useState<string | null>(null);
  const [touchGhost, setTouchGhost] = useState<{ x: number; y: number; text: string } | null>(null);
  const [touchDragTo, setTouchDragTo] = useState<'Applied' | 'Interview' | 'Offer' | 'Rejected' | null>(null);

  const findStatusAtPoint = (x: number, y: number): 'Applied' | 'Interview' | 'Offer' | 'Rejected' | null => {
    if (typeof document === 'undefined') return null;
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!el) return null;
    const col = el.closest('[data-status]') as HTMLElement | null;
    const s = col?.getAttribute('data-status');
    if (s === 'Applied' || s === 'Interview' || s === 'Offer' || s === 'Rejected') return s;
    return null;
  };

  const handleTouchStartCard = (app: ApplicationRow) => {
    setTouchDragAppId(app.id);
    setTouchGhost({ x: 0, y: 0, text: app.position });
    try {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } catch { /* ignore */ }
  };

  const handleTouchMoveCard = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchDragAppId) return;
    const t = e.touches[0];
    if (!t) return;
    setTouchGhost(g => (g ? { ...g, x: t.clientX, y: t.clientY } : { x: t.clientX, y: t.clientY, text: '' }));
    const s = findStatusAtPoint(t.clientX, t.clientY);
    if (s) setTouchDragTo(s);
    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEndCard = async () => {
    if (touchDragAppId && touchDragTo && user) {
      await supabase
        .from('job_applications')
        .update({ status: touchDragTo })
        .eq('id', touchDragAppId)
        .eq('user_id', user.id);
      await refresh();
    }
    setTouchDragAppId(null);
    setTouchDragTo(null);
    setTouchGhost(null);
    try {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    } catch { /* ignore */ }
  };

  // inline status update
  // superseded by enhanced status pill handler later in file
  // (duplicate removed to avoid redeclaration)

  const actionOpenIdRef = useRef<string | null>(null);
  const [actionOpenId, setActionOpenId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const onDocClick = () => {
      if (actionOpenIdRef.current) {
        setActionOpenId(null);
        actionOpenIdRef.current = null;
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const toggleActionMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = actionOpenId === id ? null : id;
    setActionOpenId(next);
    actionOpenIdRef.current = next;
  };

  const deleteApplication = async (id: string) => {
    if (!user) return;
    try {
      const { error: delErr } = await supabase.from('job_applications').delete().eq('id', id).eq('user_id', user.id);
      if (delErr) throw delErr;
      setActionOpenId(null); actionOpenIdRef.current = null;
      await refresh();
    } catch (err: unknown) {
      console.error('Delete failed', err);
    }
  };

  const markFollowedUp = async (appId: string) => {
    if (!user) return;
    try {
      // Complete any open activities for this application
      await supabase
        .from('activities')
        .update({ completed: true })
        .eq('user_id', user.id)
        .eq('job_application_id', appId)
        .eq('completed', false);
      // Optionally insert a log entry (commented out)
      // await supabase.from('activities').insert({ user_id: user.id, job_application_id: appId, title: 'Followed up', completed: true, type: 'other', due_date: null });
      setActionOpenId(null); actionOpenIdRef.current = null;
      await refresh();
    } catch (err: unknown) {
      console.error('Follow up failed', err);
    }
  };

  // Inline date editing helpers
  const updateDateInline = async (
    id: string,
    field: 'applied_date' | 'interview_date' | 'offer_date' | 'rejected_date',
    value: string
  ) => {
    if (!user) return;
    try {
      const payload: Record<string, string | null> = {};
      payload[field] = value || null;
      const { error: updErr } = await supabase
        .from('job_applications')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id);
      if (updErr) throw updErr;
      await new Promise(res => setTimeout(res, 100));
      await refresh();
    } catch (err: unknown) {
      console.error('Date update failed', err);
    }
  };

  const toLocalDateInput = (iso?: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    return `${yyyy}-${mm}-${dd}`;
  };

  const formatStatusDate = (app: ApplicationRow): string => {
    const s = app.status as Status | undefined;
    if (s === 'Interview' && app.interview_date) return new Date(app.interview_date).toLocaleDateString();
    if (s === 'Offer' && app.offer_date) return new Date(app.offer_date).toLocaleDateString();
    if (s === 'Rejected' && app.rejected_date) return new Date(app.rejected_date).toLocaleDateString();
    // For 'Applied' or missing dates, show dash
    return '-';
  };

  const [statusOpenId, setStatusOpenId] = useState<string | null>(null);
  const statusOpenIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handleDocClick = () => {
      if (statusOpenIdRef.current) {
        setStatusOpenId(null);
        statusOpenIdRef.current = null;
      }
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  const toggleStatusMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = statusOpenId === id ? null : id;
    setStatusOpenId(next);
    statusOpenIdRef.current = next;
  };

  const updateStatusInline = async (id: string, newStatus: Status) => {
    if (!user) return;
    await supabase.from('job_applications').update({ status: newStatus }).eq('id', id).eq('user_id', user.id);
    setStatusOpenId(null); statusOpenIdRef.current = null;
    await refresh();
  };

  // Realtime sync with Calendar/Tasks updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('apps-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications', filter: `user_id=eq.${user.id}` }, () => {
        refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities', filter: `user_id=eq.${user.id}` }, () => {
        refresh();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refresh]);

  const { t } = useI18n();

  return (
    <ApplicationsContainer>
      <TopBar>
        <Header>{t('nav.applications')}</Header>
        <ViewToggle>
          <ToggleButton $active={view==='list'} onClick={() => setView('list')}>List</ToggleButton>
          <ToggleButton $active={view==='kanban'} onClick={() => setView('kanban')}>Kanban</ToggleButton>
          <CreateButtonInline onClick={handleOpenCreate}>Create Application</CreateButtonInline>
        </ViewToggle>
      </TopBar>

      {view === 'list' && (
        <>
          <FiltersContainer>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <FilterHeader style={{ margin: 0 }}>Filters</FilterHeader>
              <SecondaryButton type="button" onClick={() => setFiltersOpen(v=>!v)}>{filtersOpen ? 'Hide' : 'Show'}</SecondaryButton>
            </div>
            {filtersOpen && (
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
                <FilterGroup>
                  <FilterLabel>Sort by</FilterLabel>
                  <FilterSelect value={sortField} onChange={(e) => setSortField(e.target.value as 'applied_date'|'company_name'|'status')}>
                    <option value="applied_date">Applied Date</option>
                    <option value="company_name">Company</option>
                    <option value="status">Status</option>
                  </FilterSelect>
                </FilterGroup>
              </FilterOptions>
            )}
          </FiltersContainer>

          {selectedIds.size > 0 && (
            <BulkBar>
              <span style={{ color:'#94A3B8' }}>{selectedIds.size} selected</span>
              <SmallSelectInline value={bulkStatus} onChange={(e)=>setBulkStatus(e.target.value as Status)}>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </SmallSelectInline>
              <PrimaryButton type="button" onClick={bulkUpdateStatus}>Change Status</PrimaryButton>
              <DangerButton type="button" onClick={bulkDelete}>Delete</DangerButton>
            </BulkBar>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeader style={{ width: 36 }}>
                    <Checkbox checked={allVisibleSelected} onChange={toggleAllVisible} />
                  </TableHeader>
                  <TableHeader>Company</TableHeader>
                  <TableHeader>Position</TableHeader>
                  <TableHeader>Date Applied</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Status Date</TableHeader>
                  <TableHeader>Next Action</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </TableHead>
              <TableBody>
                {loading && (<tr><TableCell colSpan={8}>Loading…</TableCell></tr>)}
                {error && !loading && (<tr><TableCell colSpan={8} style={{ color: '#f87171' }}>Error: {error}</TableCell></tr>)}
                {!loading && !error && rows.length === 0 && (<tr><TableCell colSpan={8}>No applications yet.</TableCell></tr>)}
                {!loading && !error && rows.map(app => (
                  <TableRow key={app.id} onClick={() => openPreview(app)} style={{ cursor: 'pointer' }}>
                    <TableCell onClick={(e)=>e.stopPropagation()}>
                      <Checkbox checked={selectedIds.has(app.id)} onChange={()=>toggleOne(app.id)} />
                    </TableCell>
                    <TableCell>{app.company_name}</TableCell>
                    <TableCell>{app.position}</TableCell>
                    <TableCell>
                      <SmallInputInline
                        type="date"
                        value={toLocalDateInput(app.applied_date)}
                        onChange={(e) => updateDateInline(app.id, 'applied_date', e.target.value)}
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Relative>
                        <StatusPill status={app.status as Status} onClick={(e) => toggleStatusMenu(e, app.id)}>
                          <StatusDot status={app.status} />{app.status}
                        </StatusPill>
                        {statusOpenId === app.id && (
                          <StatusMenu>
                            <StatusMenuItem status="Applied" onClick={() => updateStatusInline(app.id, 'Applied')}><StatusDot status="Applied" />Applied</StatusMenuItem>
                            <StatusMenuItem status="Interview" onClick={() => updateStatusInline(app.id, 'Interview')}><StatusDot status="Interview" />Interview</StatusMenuItem>
                            <StatusMenuItem status="Offer" onClick={() => updateStatusInline(app.id, 'Offer')}><StatusDot status="Offer" />Offer</StatusMenuItem>
                            <StatusMenuItem status="Rejected" onClick={() => updateStatusInline(app.id, 'Rejected')}><StatusDot status="Rejected" />Rejected</StatusMenuItem>
                          </StatusMenu>
                        )}
                      </Relative>
                    </TableCell>
                    <TableCell>{formatStatusDate(app)}</TableCell>
                    <TableCell>
                      {nextActionByApp[app.id] ? (
                        (() => { const na = nextActionByApp[app.id]; const dueStr = na.due ? ` • ${new Date(na.due as string).toLocaleDateString()}` : ''; return <span>{na.title}{dueStr}</span>; })()
                      ) : (<span>-</span>)}
                    </TableCell>
                    <TableCell>
                      <div style={{ display:'flex', justifyContent:'flex-end', height:'100%' }}>
                        <Relative>
                          <KebabButton onClick={(e) => toggleActionMenu(e, app.id)}>⋮</KebabButton>
                          {actionOpenId === app.id && (
                            <ActionMenu>
                              <ActionItem onClick={() => handleOpenEdit(app)}>Edit</ActionItem>
                              <ActionItem onClick={() => deleteApplication(app.id)}>Delete</ActionItem>
                              <ActionItem onClick={() => markFollowedUp(app.id)}>Mark Followed Up</ActionItem>
                            </ActionMenu>
                          )}
                        </Relative>
                      </div>
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
        </>
      )}

      {view === 'kanban' && (
        <>
          <FiltersContainer>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <FilterHeader style={{ margin: 0 }}>Filters</FilterHeader>
              <SecondaryButton type="button" onClick={() => setFiltersOpen(v=>!v)}>{filtersOpen ? 'Hide' : 'Show'}</SecondaryButton>
            </div>
            {filtersOpen && (
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
            )}
          </FiltersContainer>

          <Kanban>
            <Column $variant="applied" data-status="Applied" onDragOver={allowDrop} onDrop={(e) => handleColumnDrop(e, 'Applied')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ColumnHeader>Applied ({byStatus('Applied').length})</ColumnHeader>
                <ColumnHeaderRight>
                  <AddMini type="button" onClick={() => handleOpenCreateWithStatus('Applied')}>+ Add</AddMini>
                </ColumnHeaderRight>
              </div>
              {byStatus('Applied').map(app => (
                <Card
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleCardDragStart(e, app.id)}
                  onTouchStart={() => handleTouchStartCard(app)}
                  onTouchMove={handleTouchMoveCard}
                  onTouchEnd={handleTouchEndCard}
                  onClick={() => openPreview(app)}
                  style={{ cursor:'pointer', opacity: touchDragAppId === app.id ? 0.4 : 1 }}
                >
                  <CardDeleteBtn type="button" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(app.id); }} title="Delete">
                    🗑
                  </CardDeleteBtn>
                  <div style={{ fontWeight: 700 }}>{app.position}</div>
                  <div style={{ color: '#9aa4b2', fontSize: '0.85rem' }}>{app.company_name}</div>
                  <div style={{ fontSize: '0.8rem' }}>Next: {nextActionByApp[app.id]?.title || '-'}</div>
                  <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem' }}>{app.applied_date || '-'}</span>
                    <EditButton type="button" onClick={(e) => { e.stopPropagation(); handleOpenEdit(app); }}>Edit</EditButton>
                  </div>
                </Card>
              ))}
            </Column>
            <Column $variant="interview" data-status="Interview" onDragOver={allowDrop} onDrop={(e) => handleColumnDrop(e, 'Interview')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ColumnHeader>Interview ({byStatus('Interview').length})</ColumnHeader>
                <ColumnHeaderRight>
                  <AddMini type="button" onClick={() => handleOpenCreateWithStatus('Interview')}>+ Add</AddMini>
                </ColumnHeaderRight>
              </div>
              {byStatus('Interview').map(app => (
                <Card
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleCardDragStart(e, app.id)}
                  onTouchStart={() => handleTouchStartCard(app)}
                  onTouchMove={handleTouchMoveCard}
                  onTouchEnd={handleTouchEndCard}
                  onClick={() => openPreview(app)}
                  style={{ cursor:'pointer', opacity: touchDragAppId === app.id ? 0.4 : 1 }}
                >
                  <CardDeleteBtn type="button" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(app.id); }} title="Delete">
                    🗑
                  </CardDeleteBtn>
                  <div style={{ fontWeight: 700 }}>{app.position}</div>
                  <div style={{ color: '#9aa4b2', fontSize: '0.85rem' }}>{app.company_name}</div>
                  <div style={{ fontSize: '0.8rem' }}>Next: {nextActionByApp[app.id]?.title || '-'}</div>
                  <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem' }}>{app.applied_date || '-'}</span>
                    <EditButton type="button" onClick={(e) => { e.stopPropagation(); handleOpenEdit(app); }}>Edit</EditButton>
                  </div>
                </Card>
              ))}
            </Column>
            <Column $variant="offer" data-status="Offer" onDragOver={allowDrop} onDrop={(e) => handleColumnDrop(e, 'Offer')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ColumnHeader>Offer ({byStatus('Offer').length})</ColumnHeader>
                <ColumnHeaderRight>
                  <AddMini type="button" onClick={() => handleOpenCreateWithStatus('Offer')}>+ Add</AddMini>
                </ColumnHeaderRight>
              </div>
              {byStatus('Offer').map(app => (
                <Card
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleCardDragStart(e, app.id)}
                  onTouchStart={() => handleTouchStartCard(app)}
                  onTouchMove={handleTouchMoveCard}
                  onTouchEnd={handleTouchEndCard}
                  onClick={() => openPreview(app)}
                  style={{ cursor:'pointer', opacity: touchDragAppId === app.id ? 0.4 : 1 }}
                >
                  <CardDeleteBtn type="button" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(app.id); }} title="Delete">
                    🗑
                  </CardDeleteBtn>
                  <div style={{ fontWeight: 700 }}>{app.position}</div>
                  <div style={{ color: '#9aa4b2', fontSize: '0.85rem' }}>{app.company_name}</div>
                  <div style={{ fontSize: '0.8rem' }}>Next: {nextActionByApp[app.id]?.title || '-'}</div>
                  <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem' }}>{app.applied_date || '-'}</span>
                    <EditButton type="button" onClick={(e) => { e.stopPropagation(); handleOpenEdit(app); }}>Edit</EditButton>
                  </div>
                </Card>
              ))}
            </Column>
            <Column $variant="rejected" data-status="Rejected" onDragOver={allowDrop} onDrop={(e) => handleColumnDrop(e, 'Rejected')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ColumnHeader>Rejected ({byStatus('Rejected').length})</ColumnHeader>
                <ColumnHeaderRight>
                  <AddMini type="button" onClick={() => handleOpenCreateWithStatus('Rejected')}>+ Add</AddMini>
                </ColumnHeaderRight>
              </div>
              {byStatus('Rejected').map(app => (
                <Card
                  key={app.id}
                  draggable
                  onDragStart={(e) => handleCardDragStart(e, app.id)}
                  onTouchStart={() => handleTouchStartCard(app)}
                  onTouchMove={handleTouchMoveCard}
                  onTouchEnd={handleTouchEndCard}
                  onClick={() => openPreview(app)}
                  style={{ cursor:'pointer', opacity: touchDragAppId === app.id ? 0.4 : 1 }}
                >
                  <CardDeleteBtn type="button" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(app.id); }} title="Delete">
                    🗑
                  </CardDeleteBtn>
                  <div style={{ fontWeight: 700 }}>{app.position}</div>
                  <div style={{ color: '#9aa4b2', fontSize: '0.85rem' }}>{app.company_name}</div>
                  <div style={{ fontSize: '0.8rem' }}>Next: {nextActionByApp[app.id]?.title || '-'}</div>
                  <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem' }}>{app.applied_date || '-'}</span>
                    <EditButton type="button" onClick={(e) => { e.stopPropagation(); handleOpenEdit(app); }}>Edit</EditButton>
                  </div>
                </Card>
              ))}
            </Column>
          </Kanban>
          {!!touchGhost && (
            <DragGhost style={{ transform: `translate(${touchGhost.x}px, ${touchGhost.y}px)` }}>
              {touchGhost.text}
            </DragGhost>
          )}
        </>
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
                <Label htmlFor="e-status-date">Status Date</Label>
                <Input id="e-status-date" type="date" value={eStatusDate} onChange={(e) => setEStatusDate(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="e-url">Job URL (optional)</Label>
                <Input id="e-url" placeholder="https://..." value={eUrl} onChange={(e) => setEUrl(e.target.value)} />
              </div>
            </ModalRow>
            <ModalRow>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label htmlFor="e-notes">Notes</Label>
                <Input as="textarea" id="e-notes" rows={4} value={eNotes} onChange={(e) => setENotes(e.target.value)} />
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
      {confirmDeleteId && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Delete application</ModalTitle>
            <p style={{ color: '#94A3B8', margin: '0 0 1rem 0' }}>
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <ModalActions>
              <SecondaryButton type="button" onClick={() => setConfirmDeleteId(null)}>Cancel</SecondaryButton>
              <DangerButton type="button" onClick={async () => { await deleteApplication(confirmDeleteId); setConfirmDeleteId(null); }}>Delete</DangerButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}

      {showPreview && previewApp && (
        <ModalBackdrop>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Application Details</ModalTitle>
            <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>Company</div>
            <div style={{ color: 'inherit', fontWeight: 600, marginBottom: '0.5rem' }}>{previewApp.company_name}</div>
            <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>Position</div>
            <div style={{ color: 'inherit', marginBottom: '0.75rem' }}>{previewApp.position}</div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Status</div>
                <div style={{ color:'inherit' }}>{String(previewApp.status)}</div>
              </div>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Applied Date</div>
                <div style={{ color:'inherit' }}>{previewApp.applied_date ?? '-'}</div>
              </div>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Status Date</div>
                <div style={{ color:'inherit' }}>{
                  (() => {
                    const s = String(previewApp.status);
                    if (s === 'Interview' && previewApp.interview_date) return previewApp.interview_date;
                    if (s === 'Offer' && previewApp.offer_date) return previewApp.offer_date;
                    if (s === 'Rejected' && previewApp.rejected_date) return previewApp.rejected_date;
                    return '-';
                  })()
                }</div>
              </div>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Created</div>
                <div style={{ color:'inherit' }}>{(previewApp as any).created_at ? new Date((previewApp as any).created_at).toLocaleDateString() : '-'}</div>
              </div>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Updated</div>
                <div style={{ color:'inherit' }}>{(previewApp as any).updated_at ? new Date((previewApp as any).updated_at).toLocaleDateString() : '-'}</div>
              </div>
            </div>

            <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>Next Action</div>
            <div style={{ color:'inherit', marginBottom:'0.75rem' }}>{
              (()=>{ const na = nextActionByApp[previewApp.id]; if (!na) return '-'; const dueStr = na.due ? ` • ${new Date(na.due).toLocaleDateString()}` : ''; return `${na.title}${dueStr}`; })()
            }</div>

            <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>Notes</div>
            <div style={{ color: 'inherit', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{previewApp.notes || '-'}</div>

            {previewApp.url && (
              <div style={{ marginBottom: '1rem' }}>
                <a href={previewApp.url} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>Open job link</a>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <SecondaryButton type="button" onClick={() => setShowPreview(false)}>Close</SecondaryButton>
              <PrimaryButton type="button" onClick={() => { setShowPreview(false); handleOpenEdit(previewApp); }}>Edit</PrimaryButton>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}
    </ApplicationsContainer>
  );
};

export default Applications;