import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

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

type ActivityRow = {
  id: string;
  title: string;
  due_date: string | null;
  completed: boolean;
  job_application_id: string | null;
  type: 'note' | 'call' | 'email' | 'meeting' | 'other' | string;
  created_at: string;
};

export const Tasks: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [appOptions, setAppOptions] = useState<Array<{ id: string; company_name: string; position: string }>>([]);

  // Edit Task state
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [eTitle, setETitle] = useState('');
  const [eDueDate, setEDueDate] = useState<string>('');
  const [eType, setEType] = useState<'note' | 'call' | 'email' | 'meeting' | 'other'>('note');
  const [eCompleted, setECompleted] = useState(false);
  const [eApplicationId, setEApplicationId] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [saveErrorEdit, setSaveErrorEdit] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      const [tasksRes, appsRes] = await Promise.all([
        supabase
          .from('activities')
          .select('id, title, due_date, completed, job_application_id, type, created_at')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true }),
        supabase
          .from('job_applications')
          .select('id, company_name, position')
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
        setAppOptions(appsRes.data as Array<{ id: string; company_name: string; position: string }>);
      }
      setLoading(false);
    };
    fetchTasks();
    return () => { isMounted = false };
  }, [user]);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('activities')
      .select('id, title, due_date, completed, job_application_id, type, created_at')
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
      const insert = {
        user_id: user.id,
        job_application_id: applicationId,
        title: title.trim(),
        description: null,
        due_date: dueDate || null,
        completed: false,
        type: taskType,
      };
      const { error } = await supabase.from('activities').insert(insert);
      if (error) throw error;
      setShowCreate(false);
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
      };
      const { error } = await supabase
        .from('activities')
        .update(update)
        .eq('id', editId)
        .eq('user_id', user.id);
      if (error) throw error;
      setShowEdit(false);
      await refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update task';
      setSaveErrorEdit(message);
    } finally {
      setSavingEdit(false);
    }
  };

  const toggleCompleted = async (row: ActivityRow) => {
    if (!user) return;
    const next = !row.completed;
    // optimistic update
    setRows(prev => prev.map(r => r.id === row.id ? { ...r, completed: next } : r));
    const { error } = await supabase
      .from('activities')
      .update({ completed: next })
      .eq('id', row.id)
      .eq('user_id', user.id);
    if (error) {
      // revert on error
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, completed: row.completed } : r));
    }
  };
 
  return (
    <TasksContainer>
      <TopBar>
        <Header>Tasks</Header>
        <CreateButton onClick={openCreate}>Create Task</CreateButton>
      </TopBar>
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
          <TaskItem key={task.id}>
            <Checkbox checked={task.completed} onChange={() => toggleCompleted(task)} />
            <TaskContent>
              <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
              <TaskDetails>
                <TaskDueDate>Due: {task.due_date ?? '-'}</TaskDueDate>
                {task.job_application_id ? (
                  <TaskApplication onClick={() => navigate('/applications?appId=' + task.job_application_id)}>
                    Linked application
                  </TaskApplication>
                ) : (
                  <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>General Task</span>
                )}
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Type: {String(task.type)}</span>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>Created: {new Date(task.created_at).toLocaleDateString()}</span>
              </TaskDetails>
            </TaskContent>
            <RowActions>
              <ActionButton type="button" onClick={() => openEdit(task)}>Edit</ActionButton>
            </RowActions>
          </TaskItem>
        ))}
      </TaskListContainer>

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
    </TasksContainer>
  );
};

export default Tasks;