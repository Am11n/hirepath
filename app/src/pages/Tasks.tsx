import type { FC } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nProvider';

const TasksContainer = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  margin-bottom: 1rem;
  gap: 0.25rem;
  
  @media (min-width: 480px) {
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
    gap: 0;
  }
`;

const Tab = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bodyText};
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? 600 : 400};
  cursor: pointer;
  position: relative;
  border-radius: 6px;
  
  &:hover {
    color: ${props => props.theme.colors.headings};
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  ${props => props.$active && `
    background-color: rgba(59, 130, 246, 0.1);
  `}
  
  @media (min-width: 480px) {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    
    &:hover {
      background-color: transparent;
    }
    
    ${props => props.$active && `
      background-color: transparent;
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: ${props.theme.colors.primary};
      }
    `}
  }
`;

const TaskListContainer = styled.div`
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

const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (min-width: 480px) {
    padding: 1rem 0;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.borders};
  background-color: rgba(255, 255, 255, 0.05);
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:checked {
    background-color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:checked::after {
    content: '✓';
    color: white;
    font-size: 0.65rem;
  }
  
  @media (min-width: 480px) {
    margin-right: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    
    &:checked::after {
      font-size: 0.75rem;
    }
  }
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.span<{ $completed?: boolean }>`
  color: ${props => props.$completed ? props.theme.colors.bodyText : props.theme.colors.headings};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  font-size: 0.9rem;
  display: block;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const TaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    gap: 0.75rem;
    margin-top: 0.375rem;
  }
  
  @media (min-width: 768px) {
    gap: 1rem;
    margin-top: 0.25rem;
  }
`;

const TaskDueDate = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.8rem;
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const TaskApplication = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 0.8rem;
  text-decoration: underline;
  cursor: pointer;
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
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

const Select = styled.select`
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.9rem;
  width: 100%;
`;

const RowActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
  align-items: center;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.06);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
`;

const DeleteIconButton = styled.button`
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  width: 36px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
`;

// Kanban styles for tasks
const TaskKanban = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
`;

const TaskColumn = styled.div<{ $variant: 'todo' | 'in_progress' | 'done' }>`
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 12px;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.borders};
  background: ${props => {
    const v = props.$variant;
    const bg = v === 'todo'
      ? 'rgba(59, 130, 246, 0.18)'
      : v === 'in_progress'
        ? 'rgba(234, 179, 8, 0.18)'
        : 'rgba(34, 197, 94, 0.18)';
    return `linear-gradient(to bottom right, ${bg}, rgba(255,255,255,0.07))`;
  }};
`;

const TaskColumnHeader = styled.h3`
  color: ${props => props.theme.colors.headings};
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const TaskCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 10px;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  cursor: grab;
  position: relative;
  touch-action: none; /* prevent page scroll while touch-dragging */
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

const SecondaryButton = styled.button`
  background: rgba(255,255,255,0.06);
  color: ${props => props.theme.colors.headings};
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255,255,255,0.1);
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
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
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

type ActivityRow = {
  id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  // Optional status column (if present in DB)
  status?: 'todo' | 'in_progress' | 'done' | string;
  job_application_id: string | null;
  type: 'note' | 'call' | 'email' | 'meeting' | 'other' | string;
  created_at: string;
  description?: string | null; // used as Notes
};

export const Tasks: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStatusCol, setHasStatusCol] = useState<boolean>(false);
  const [view, setView] = useState<'list' | 'kanban'>(() => (localStorage.getItem('tasks:view') === 'kanban' ? 'kanban' : 'list'));
  useEffect(() => { localStorage.setItem('tasks:view', view); }, [view]);
  const [activeTab, setActiveTab] = useState<'All' | 'Due Today' | 'Overdue' | 'Completed'>(() => {
    const v = localStorage.getItem('tasks:tab');
    if (v === 'Due Today' || v === 'Overdue' || v === 'Completed') return v;
    return 'All';
  });
  useEffect(() => {
    localStorage.setItem('tasks:tab', activeTab);
  }, [activeTab]);

  // Create Task state
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>('');
  const [taskType, setTaskType] = useState<'note' | 'call' | 'email' | 'meeting' | 'other'>('note');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string>('');
  const [appOptions, setAppOptions] = useState<Array<{ id: string; company_name: string; position: string; notes: string | null }>>([]);
  const appById = useMemo(() => {
    const map = new Map<string, { id: string; company_name: string; position: string; notes: string | null }>();
    appOptions.forEach(o => map.set(o.id, o));
    return map;
  }, [appOptions]);
  const [createStatus, setCreateStatus] = useState<'todo' | 'in_progress' | 'done' | null>(null);

  // Edit Task state
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [eTitle, setETitle] = useState('');
  const [eDueDate, setEDueDate] = useState<string>('');
  const [eType, setEType] = useState<'note' | 'call' | 'email' | 'meeting' | 'other'>('note');
  const [eCompleted, setECompleted] = useState(false);
  const [eApplicationId, setEApplicationId] = useState<string>('');
  const [eNotes, setENotes] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveErrorEdit, setSaveErrorEdit] = useState<string | null>(null);

  // Delete Task state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Preview state (non-edit)
  const [showPreview, setShowPreview] = useState(false);
  const [previewTask, setPreviewTask] = useState<ActivityRow | null>(null);

  const openPreview = (row: ActivityRow) => {
    setPreviewTask(row);
    setShowPreview(true);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      if (!user) return;
      // Probe for optional status column
      try {
        const probe = await supabase.from('activities').select('status').limit(1);
        if (!probe.error) setHasStatusCol(true);
      } catch { /* ignore */ }
      setLoading(true);
      setError(null);
      const tasksPromise = hasStatusCol
        ? supabase
            .from('activities')
            .select('id, title, due_date, completed, status, job_application_id, type, created_at, description')
        : supabase
            .from('activities')
            .select('id, title, due_date, completed, job_application_id, type, created_at, description');
      const [tasksRes, appsRes] = await Promise.all([
        tasksPromise.eq('user_id', user.id).order('due_date', { ascending: true }),
        supabase
          .from('job_applications')
          .select('id, company_name, position, notes')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);
      if (!isMounted) return;
      if (tasksRes.error) {
        setError(tasksRes.error.message);
        setRows([]);
      } else {
        setRows((tasksRes.data || []) as ActivityRow[]);
      }
      if (!appsRes.error && appsRes.data) {
        setAppOptions(appsRes.data as Array<{ id: string; company_name: string; position: string; notes: string | null }>);
      }
      setLoading(false);
    };
    fetchTasks();
    return () => { isMounted = false };
  }, [user, hasStatusCol]);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const tasksQuery = hasStatusCol
      ? supabase
          .from('activities')
          .select('id, title, due_date, completed, status, job_application_id, type, created_at, description')
      : supabase
          .from('activities')
          .select('id, title, due_date, completed, job_application_id, type, created_at, description');
    const { data, error } = await tasksQuery
      .eq('user_id', user.id)
      .order('due_date', { ascending: true });
    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows((data || []) as ActivityRow[]);
    }
    setLoading(false);
  };

  const filtered = rows.filter(r => {
    const today = new Date().toISOString().slice(0, 10);
    if (activeTab === 'Due Today') return r.due_date === today && !r.completed;
    if (activeTab === 'Overdue') return (r.due_date ?? '') < today && !r.completed;
    if (activeTab === 'Completed') return r.completed;
    return true;
  });

  const openCreate = () => {
    setTitle('');
    setDueDate('');
    setTaskType('note');
    setApplicationId('');
    setSaveError(null);
    setShowCreate(true);
  };

  const openCreateInStatus = (statusKey: 'todo' | 'in_progress' | 'done') => {
    setCreateStatus(statusKey);
    openCreate();
  };

  const saveTask = async () => {
    if (!user) return;
    if (!title.trim()) {
      setSaveError('Title is required');
      return;
    }
    if (!applicationId) {
      setSaveError('Please link this task to an application');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const insert: Record<string, unknown> = {
        user_id: user.id,
        job_application_id: applicationId,
        title: title.trim(),
        description: null,
        due_date: dueDate || null,
        completed: createStatus === 'done' ? true : false,
        type: taskType,
      };
      if (hasStatusCol && createStatus) insert.status = createStatus;
      const { error } = await supabase.from('activities').insert(insert);
      if (error) throw error;
      setShowCreate(false);
      setCreateStatus(null);
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to create task';
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (row: ActivityRow) => {
    setEditId(row.id);
    setETitle(row.title);
    setEDueDate(row.due_date || '');
    const t = row.type;
    setEType(t === 'note' || t === 'call' || t === 'email' || t === 'meeting' || t === 'other' ? (t as 'note' | 'call' | 'email' | 'meeting' | 'other') : 'note');
    setECompleted(!!row.completed);
    setEApplicationId(row.job_application_id || '');
    if (row.job_application_id) {
      const a = appById.get(row.job_application_id);
      setENotes((a?.notes || ''));
    } else {
      setENotes((row.description || ''));
    }
    setSaveErrorEdit(null);
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!user || !editId) return;
    if (!eTitle.trim()) {
      setSaveErrorEdit('Title is required');
      return;
    }
    if (!eApplicationId) {
      setSaveErrorEdit('Please link this task to an application');
      return;
    }
    setSavingEdit(true);
    setSaveErrorEdit(null);
    try {
      const update: Record<string, unknown> = {
        title: eTitle.trim(),
        due_date: eDueDate || null,
        type: eType,
        completed: eCompleted,
        job_application_id: eApplicationId,
        description: (!eApplicationId && eNotes.trim()) ? eNotes.trim() : null,
      };
      const { error } = await supabase
        .from('activities')
        .update(update)
        .eq('id', editId)
        .eq('user_id', user.id);
      if (error) throw error;
      // If linked to application, also update app notes to keep in sync
      if (eApplicationId) {
        await supabase
          .from('job_applications')
          .update({ notes: eNotes.trim() ? eNotes.trim() : null })
          .eq('id', eApplicationId)
          .eq('user_id', user.id);
      }
      setShowEdit(false);
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update task';
      setSaveErrorEdit(message);
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) {
      await refresh();
    }
  };

  const updateTaskStatus = async (id: string, to: 'in_progress' | 'done') => {
    if (!user) return;
    const payload: Record<string, unknown> = { completed: to === 'done' };
    if (hasStatusCol) payload.status = to;
    const { error } = await supabase.from('activities').update(payload).eq('id', id).eq('user_id', user.id);
    if (!error) {
      // optimistic reflect
      setRows(prev => prev.map(r => r.id === id ? { ...r, completed: to === 'done', status: hasStatusCol ? to : r.status } : r));
      if (previewTask && previewTask.id === id) setPreviewTask({ ...previewTask, completed: to === 'done', status: hasStatusCol ? to : previewTask.status });
    }
  };

  const toggleCompleted = async (row: ActivityRow) => {
    const to = row.completed ? 'in_progress' : 'done';
    await updateTaskStatus(row.id, to);
  };
 
  // Kanban helpers
  const getTaskStatus = (t: ActivityRow): 'todo' | 'in_progress' | 'done' => {
    if (hasStatusCol) {
      const s = (t.status || '').toString();
      if (s === 'in_progress') return 'in_progress';
      if (s === 'done') return 'done';
      return 'todo';
    }
    return t.completed ? 'done' : 'todo';
  };

  const tasksBy = (s: 'todo' | 'in_progress' | 'done') => rows.filter(r => getTaskStatus(r) === s);

  const handleTaskDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleTaskColumnDrop = async (e: React.DragEvent<HTMLDivElement>, to: 'todo' | 'in_progress' | 'done') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id || !user) return;
    const payload: Record<string, unknown> = {};
    payload.completed = to === 'done';
    if (hasStatusCol) payload.status = to;
    const { error } = await supabase.from('activities').update(payload).eq('id', id).eq('user_id', user.id);
    if (!error) await refresh();
  };
 
  // Touch DnD support
  const [touchTaskId, setTouchTaskId] = useState<string | null>(null);
  const [touchTaskTo, setTouchTaskTo] = useState<'todo' | 'in_progress' | 'done' | null>(null);
  const [touchGhost, setTouchGhost] = useState<{ x: number; y: number; text: string } | null>(null);

  const findTaskStatusAtPoint = (x: number, y: number): 'todo' | 'in_progress' | 'done' | null => {
    if (typeof document === 'undefined') return null;
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    if (!el) return null;
    const col = el.closest('[data-task-status]') as HTMLElement | null;
    const s = col?.getAttribute('data-task-status');
    if (s === 'todo' || s === 'in_progress' || s === 'done') return s;
    return null;
  };

  const handleTaskTouchStart = (id: string, text: string) => {
    setTouchTaskId(id);
    setTouchGhost({ x: 0, y: 0, text });
    try {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } catch { /* ignore */ }
  };
  const handleTaskTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchTaskId) return;
    const t = e.touches[0];
    if (!t) return;
    setTouchGhost(g => (g ? { ...g, x: t.clientX, y: t.clientY } : { x: t.clientX, y: t.clientY, text: '' }));
    const s = findTaskStatusAtPoint(t.clientX, t.clientY);
    if (s) setTouchTaskTo(s);
    if (e.cancelable) e.preventDefault();
  };
  const handleTaskTouchEnd = async () => {
    if (touchTaskId && touchTaskTo && user) {
      const payload: Record<string, unknown> = { completed: touchTaskTo === 'done' };
      if (hasStatusCol) payload.status = touchTaskTo;
      const { error } = await supabase.from('activities').update(payload).eq('id', touchTaskId).eq('user_id', user.id);
      if (!error) await refresh();
    }
    setTouchTaskId(null);
    setTouchTaskTo(null);
    setTouchGhost(null);
    try {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    } catch { /* ignore */ }
  };

  // Realtime sync with Applications/Calendar updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('tasks-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities', filter: `user_id=eq.${user.id}` }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications', filter: `user_id=eq.${user.id}` }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refresh]);

  return (
    <TasksContainer>
      <TopBar>
        <Header>{t('nav.tasks')}</Header>
        <div style={{ display:'flex', gap: '0.5rem', alignItems:'center' }}>
          <ViewToggle>
            <ToggleButton $active={view==='list'} onClick={() => setView('list')}>List</ToggleButton>
            <ToggleButton $active={view==='kanban'} onClick={() => setView('kanban')}>Kanban</ToggleButton>
          </ViewToggle>
          <CreateButton onClick={openCreate}>Create Task</CreateButton>
        </div>
      </TopBar>
      {view === 'list' && (
      <>
      <TabsContainer>
        <Tab $active={activeTab === 'All'} onClick={() => setActiveTab('All')}>All</Tab>
        <Tab $active={activeTab === 'Due Today'} onClick={() => setActiveTab('Due Today')}>Due Today</Tab>
        <Tab $active={activeTab === 'Overdue'} onClick={() => setActiveTab('Overdue')}>Overdue</Tab>
        <Tab $active={activeTab === 'Completed'} onClick={() => setActiveTab('Completed')}>Completed</Tab>
      </TabsContainer>

      <TaskListContainer>
        {loading && (<div>Loading…</div>)}
        {error && !loading && (<div style={{ color: '#f87171' }}>Error: {error}</div>)}
        {!loading && !error && filtered.length === 0 && (<div>No tasks.</div>)}
        {!loading && !error && filtered.map(task => (
          <TaskItem key={task.id} onClick={() => openPreview(task)} style={{ cursor: 'pointer' }}>
            <Checkbox checked={task.completed} onClick={(e)=>e.stopPropagation()} onChange={() => toggleCompleted(task)} />
            <TaskContent>
              <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
              <TaskDetails>
                <TaskDueDate>Due: {task.due_date ?? '-'}</TaskDueDate>
                {task.job_application_id ? (() => {
                  const a = appById.get(task.job_application_id!);
                  const label = a ? `${a.company_name} — ${a.position}` : 'Linked application';
                  return (
                    <TaskApplication onClick={(e) => { e.stopPropagation(); navigate('/applications?appId=' + task.job_application_id) }}>
                      {label}
                    </TaskApplication>
                  );
                })() : (
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>General Task</span>
                )}
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Type: {String(task.type)}</span>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Created: {new Date(task.created_at).toLocaleDateString()}</span>
              </TaskDetails>
            </TaskContent>
            <RowActions>
              <ActionButton type="button" onClick={(e) => { e.stopPropagation(); openEdit(task); }}>Edit</ActionButton>
              <DeleteIconButton type="button" title="Delete" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(task.id); }}>🗑</DeleteIconButton>
            </RowActions>
          </TaskItem>
        ))}
      </TaskListContainer>
      </>
      )}

      {view === 'kanban' && (
        <TaskKanban>
          <TaskColumn $variant="todo" data-task-status="todo" onDragOver={allowDrop} onDrop={(e) => handleTaskColumnDrop(e, 'todo')}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <TaskColumnHeader>To Do ({tasksBy('todo').length})</TaskColumnHeader>
              <AddMini type="button" onClick={() => openCreateInStatus('todo')}>+ Add task</AddMini>
            </div>
            {tasksBy('todo').map(t => (
              <TaskCard
                key={t.id}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, t.id)}
                onTouchStart={() => handleTaskTouchStart(t.id, t.title)}
                onTouchMove={handleTaskTouchMove}
                onTouchEnd={handleTaskTouchEnd}
                title={deadlineStatusLabel(t.due_date)}
                onClick={() => openPreview(t)}
                style={{ cursor: 'pointer', opacity: touchTaskId === t.id ? 0.4 : 1 }}
              >
                <div style={{ fontWeight: 700, borderTop: `3px solid ${deadlineColor(t.due_date)}`, paddingTop: '4px' }}>{t.title}</div>
                {t.job_application_id ? (() => {
                  const a = appById.get(t.job_application_id!);
                  const label = a ? `${a.company_name} — ${a.position}` : 'Linked application';
                  return (
                    <TaskApplication onClick={(e) => { e.stopPropagation(); navigate('/applications?appId=' + t.job_application_id) }}>
                      {label}
                    </TaskApplication>
                  );
                })() : (
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>General Task</span>
                )}
                <div style={{ color: '#9aa4b2', fontSize: '0.85rem' }}>Due: {t.due_date ?? '-'}</div>
                <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString() : ''}</span>
                  <div style={{ display:'flex', gap: '0.4rem' }}>
                    <ActionButton type="button" onClick={(e) => { e.stopPropagation(); openEdit(t); }}>Edit</ActionButton>
                    <DeleteIconButton type="button" title="Delete" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(t.id); }}>🗑</DeleteIconButton>
                  </div>
                </div>
              </TaskCard>
            ))}
          </TaskColumn>

          <TaskColumn $variant="in_progress" data-task-status="in_progress" onDragOver={allowDrop} onDrop={(e) => handleTaskColumnDrop(e, 'in_progress')}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <TaskColumnHeader>In Progress ({tasksBy('in_progress').length})</TaskColumnHeader>
              <AddMini type="button" onClick={() => openCreateInStatus('in_progress')}>+ Add task</AddMini>
            </div>
            {tasksBy('in_progress').map(t => (
              <TaskCard
                key={t.id}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, t.id)}
                onTouchStart={() => handleTaskTouchStart(t.id, t.title)}
                onTouchMove={handleTaskTouchMove}
                onTouchEnd={handleTaskTouchEnd}
                title={deadlineStatusLabel(t.due_date)}
                onClick={() => openPreview(t)}
                style={{ cursor: 'pointer', opacity: touchTaskId === t.id ? 0.4 : 1 }}
              >
                <div style={{ fontWeight: 700, borderTop: `3px solid ${deadlineColor(t.due_date)}`, paddingTop: '4px' }}>{t.title}</div>
                {t.job_application_id ? (() => {
                  const a = appById.get(t.job_application_id!);
                  const label = a ? `${a.company_name} — ${a.position}` : 'Linked application';
                  return (
                    <TaskApplication onClick={(e) => { e.stopPropagation(); navigate('/applications?appId=' + t.job_application_id) }}>
                      {label}
                    </TaskApplication>
                  );
                })() : (
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>General Task</span>
                )}
                <div style={{ color: '#9aa4b2', fontSize: '0.85rem' }}>Due: {t.due_date ?? '-'}</div>
                <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString() : ''}</span>
                  <div style={{ display:'flex', gap: '0.4rem' }}>
                    <ActionButton type="button" onClick={(e) => { e.stopPropagation(); openEdit(t); }}>Edit</ActionButton>
                    <DeleteIconButton type="button" title="Delete" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(t.id); }}>🗑</DeleteIconButton>
                  </div>
                </div>
              </TaskCard>
            ))}
          </TaskColumn>

          <TaskColumn $variant="done" data-task-status="done" onDragOver={allowDrop} onDrop={(e) => handleTaskColumnDrop(e, 'done')}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <TaskColumnHeader>Done ({tasksBy('done').length})</TaskColumnHeader>
              <AddMini type="button" onClick={() => openCreateInStatus('done')}>+ Add task</AddMini>
            </div>
            {tasksBy('done').map(t => (
              <TaskCard
                key={t.id}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, t.id)}
                onTouchStart={() => handleTaskTouchStart(t.id, t.title)}
                onTouchMove={handleTaskTouchMove}
                onTouchEnd={handleTaskTouchEnd}
                onClick={() => openPreview(t)}
                style={{ cursor: 'pointer', opacity: touchTaskId === t.id ? 0.4 : 1 }}
              >
                <div style={{ fontWeight: 700 }}>{t.title}</div>
                {t.job_application_id ? (() => {
                  const a = appById.get(t.job_application_id!);
                  const label = a ? `${a.company_name} — ${a.position}` : 'Linked application';
                  return (
                    <TaskApplication onClick={(e) => { e.stopPropagation(); navigate('/applications?appId=' + t.job_application_id) }}>
                      {label}
                    </TaskApplication>
                  );
                })() : (
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>General Task</span>
                )}
                <div style={{ color: '#9aa4b2', fontSize: '0.85rem' }}>Due: {t.due_date ?? '-'}</div>
                <div style={{ marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem' }}>{t.created_at ? new Date(t.created_at).toLocaleDateString() : ''}</span>
                  <div style={{ display:'flex', gap: '0.4rem' }}>
                    <ActionButton type="button" onClick={(e) => { e.stopPropagation(); openEdit(t); }}>Edit</ActionButton>
                    <DeleteIconButton type="button" title="Delete" onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(t.id); }}>🗑</DeleteIconButton>
                  </div>
                </div>
              </TaskCard>
            ))}
          </TaskColumn>
        </TaskKanban>
      )}

      {(!loading && !error && rows.length === 0) && (
        <EmptyStateContainer>
          <EmptyStateTitle>No more tasks found</EmptyStateTitle>
          <EmptyStateText>Add a new task to stay organized.</EmptyStateText>
          <CreateButton onClick={openCreate}>Create Task</CreateButton>
        </EmptyStateContainer>
      )}

      {showCreate && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Create Task</ModalTitle>
            <ModalRow>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Follow up with company" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="due">Due Date (optional)</Label>
                <Input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </ModalRow>
            <ModalRow>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select id="type" value={taskType} onChange={(e) => setTaskType(e.target.value as 'note' | 'call' | 'email' | 'meeting' | 'other')}>
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="app">Link to Application</Label>
                <Select id="app" value={applicationId} onChange={(e) => setApplicationId(e.target.value)}>
                  <option value="">Choose…</option>
                  {appOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.company_name} — {opt.position}</option>
                  ))}
                </Select>
              </div>
            </ModalRow>
            {saveError && <div style={{ color: '#f87171', marginTop: '0.25rem' }}>{saveError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={() => setShowCreate(false)} disabled={saving} style={{ background: 'rgba(255,255,255,0.06)', color: 'inherit', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600 }}>Cancel</button>
              <button onClick={saveTask} disabled={saving || appOptions.length === 0} style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', color: 'white', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600 }}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
            {appOptions.length === 0 && (
              <div style={{ color: '#94A3B8', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                You have no applications yet. Create one first to link this task.
              </div>
            )}
          </ModalCard>
        </ModalBackdrop>
      )}

      {showEdit && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Edit Task</ModalTitle>
            <ModalRow>
              <div>
                <Label htmlFor="e-title">Title</Label>
                <Input id="e-title" value={eTitle} onChange={(e) => setETitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="e-due">Due Date (optional)</Label>
                <Input id="e-due" type="date" value={eDueDate} onChange={(e) => setEDueDate(e.target.value)} />
              </div>
            </ModalRow>
            <ModalRow>
              <div>
                <Label htmlFor="e-type">Type</Label>
                <Select id="e-type" value={eType} onChange={(e) => setEType(e.target.value as 'note' | 'call' | 'email' | 'meeting' | 'other')}>
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="e-app">Link to Application</Label>
                <Select id="e-app" value={eApplicationId} onChange={(e) => setEApplicationId(e.target.value)}>
                  <option value="">Choose…</option>
                  {appOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.company_name} — {opt.position}</option>
                  ))}
                </Select>
              </div>
            </ModalRow>
            <ModalRow>
              <div style={{ gridColumn: '1 / -1' }}>
                <Label htmlFor="e-notes">Notes</Label>
                <Input as="textarea" id="e-notes" rows={4} value={eNotes} onChange={(e) => setENotes(e.target.value)} />
              </div>
            </ModalRow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input id="e-completed" type="checkbox" checked={eCompleted} onChange={(e) => setECompleted(e.target.checked)} />
              <label htmlFor="e-completed" style={{ color: 'inherit', fontSize: '0.9rem' }}>Completed</label>
            </div>
            {saveErrorEdit && <div style={{ color: '#f87171', marginTop: '0.5rem' }}>{saveErrorEdit}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button onClick={() => setShowEdit(false)} disabled={savingEdit} style={{ background: 'rgba(255,255,255,0.06)', color: 'inherit', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600 }}>Cancel</button>
              <button onClick={saveEdit} disabled={savingEdit} style={{ background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)', color: 'white', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600 }}>{savingEdit ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}

      {confirmDeleteId && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Delete task</ModalTitle>
            <p style={{ color: '#94A3B8', margin: '0 0 1rem 0' }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setConfirmDeleteId(null)} style={{ background: 'rgba(255,255,255,0.06)', color: 'inherit', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600 }}>Cancel</button>
              <button onClick={async () => { if (confirmDeleteId) { await deleteTask(confirmDeleteId); } setConfirmDeleteId(null); }} style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600 }}>Delete</button>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}

      {showPreview && previewTask && (
        <ModalBackdrop>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Task Details</ModalTitle>
            <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>Title</div>
            <div style={{ color: 'inherit', fontWeight: 600, marginBottom: '0.75rem' }}>{previewTask.title}</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Type</div>
                <div style={{ color:'inherit' }}>{String(previewTask.type)}</div>
              </div>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Due Date</div>
                <div style={{ color:'inherit' }}>{previewTask.due_date ?? '-'}</div>
              </div>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Status</div>
                <div style={{ color:'inherit' }}>
                  {(() => {
                    const label = (() => {
                      if (previewTask.completed) return 'Done';
                      const d = previewTask.due_date ? new Date(previewTask.due_date) : null;
                      const today = new Date(new Date().toDateString());
                      if (d && d.getTime() < today.getTime()) return 'Overdue';
                      return 'In Progress';
                    })();
                    return <span>{label}</span>;
                  })()}
                </div>
              </div>
              <div>
                <div style={{ color:'#94A3B8', marginBottom:'0.25rem' }}>Created</div>
                <div style={{ color:'inherit' }}>{new Date(previewTask.created_at).toLocaleDateString()}</div>
              </div>
            </div>
            <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>Linked Application</div>
            <div style={{ marginBottom:'0.75rem' }}>
              {previewTask.job_application_id ? (()=>{ const a = appById.get(previewTask.job_application_id!); const label = a ? `${a.company_name} — ${a.position}` : 'Open application'; return (<TaskApplication onClick={() => navigate('/applications?appId='+previewTask.job_application_id)}>{label}</TaskApplication>); })() : (<span style={{ color:'#94A3B8' }}>None</span>)}
            </div>
            <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>Notes</div>
            <div style={{ color: 'inherit', whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{
              previewTask.job_application_id
                ? (()=>{ const a = appById.get(previewTask.job_application_id!); return (a?.notes || '—'); })()
                : (previewTask.description || '—')
            }</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <SecondaryButton type="button" onClick={() => setShowPreview(false)}>Close</SecondaryButton>
              <PrimaryButton type="button" onClick={() => { setShowPreview(false); openEdit(previewTask); }}>Edit</PrimaryButton>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}
      {!!touchGhost && (
        <DragGhost style={{ transform: `translate(${touchGhost.x}px, ${touchGhost.y}px)` }}>
          {touchGhost.text}
        </DragGhost>
      )}
    </TasksContainer>
  );
};

function deadlineStatusLabel(due: string | null): string {
  const dColor = ((): 'green' | 'yellow' | 'red' => {
    if (!due) return 'green';
    const today = new Date();
    const dueDate = new Date(due);
    const diffDays = Math.floor((dueDate.getTime() - new Date(today.toDateString()).getTime()) / (1000*60*60*24));
    if (diffDays < 0) return 'red';
    if (diffDays <= 3) return 'yellow';
    return 'green';
  })();
  return dColor === 'red' ? 'Overdue' : dColor === 'yellow' ? 'Due soon' : 'On track';
}

function deadlineColor(due: string | null): string {
  if (!due) return '#34C75E'; // Green for no due date
  const today = new Date();
  const dueDate = new Date(due);
  const diffDays = Math.floor((dueDate.getTime() - new Date(today.toDateString()).getTime()) / (1000*60*60*24));
  if (diffDays < 0) return '#EF4444'; // Red for overdue
  if (diffDays <= 3) return '#F59E0B'; // Yellow for due soon
  return '#34C75E'; // Green for on track
}

export default Tasks;