import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nProvider';
// import { useNavigate } from 'react-router-dom';

const DocumentsContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  
  @media (min-width: 480px) {
    padding: 1rem;
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }goi
`;

const Header = styled.h1`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.875rem;
    margin-bottom: 2rem;
  }
`;

const UploadArea = styled.div`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border: 2px dashed ${props => props.theme.colors.borders};
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(59, 130, 246, 0.05);
  }
  
  @media (min-width: 480px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;

const UploadIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.bodyText};
  margin-bottom: 0.75rem;
  
  @media (min-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const UploadTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
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
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 10px;
  }
`;

const DocumentsListContainer = styled.div`
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

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  
  @media (min-width: 320px) {
    font-size: 0.8rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
  
  @media (min-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${props => props.theme.colors.borders};
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.5rem;
  color: ${props => props.theme.colors.bodyText};
  font-weight: 600;
  font-size: 0.7rem;
  
  @media (min-width: 320px) {
    padding: 0.6rem;
    font-size: 0.75rem;
  }
  
  @media (min-width: 480px) {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 0.95rem;
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
  
  @media (min-width: 480px) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }
`;

const TableCell = styled.td`
  padding: 0.5rem;
  color: ${props => props.theme.colors.headings};
  font-size: 0.75rem;
  
  @media (min-width: 320px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
  
  @media (min-width: 480px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 0.95rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const DocumentName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 480px) {
    gap: 0.625rem;
  }
  
  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const DocumentIcon = styled.span`
  font-size: 1rem;
  
  @media (min-width: 480px) {
    font-size: 1.125rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DocumentLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.75rem;
  display: block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (min-width: 320px) {
    font-size: 0.8rem;
    max-width: 140px;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
    max-width: 160px;
  }
  
  @media (min-width: 768px) {
    font-size: 0.95rem;
    max-width: 200px;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
    max-width: none;
  }
`;

const DocumentType = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.6rem;
  font-weight: 600;
  
  @media (min-width: 320px) {
    padding: 0.15rem 0.55rem;
    font-size: 0.65rem;
  }
  
  @media (min-width: 480px) {
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
  }
  
  background: rgba(59, 130, 246, 0.2);
  color: ${props => props.theme.colors.primary};
`;

const MobileDocumentsList = styled.div`
  display: none;
  
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const DocumentCard = styled.div`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,.25);
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
`;

const DocumentCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const DocumentCardTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DocumentCardName = styled.a`
  color: ${props => props.theme.colors.headings};
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (min-width: 480px) {
    font-size: 1.1rem;
  }
`;

const DocumentCardType = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.2);
  color: ${props => props.theme.colors.primary};
  width: fit-content;
`;

const DocumentCardDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  
  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

const DocumentDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DocumentDetailLabel = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.8rem;
`;

const DocumentDetailValue = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.9rem;
  font-weight: 500;
`;

const EmptyStateContainer = styled.div`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  text-align: center;
  
  @media (min-width: 480px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;

const EmptyStateTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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

const Select = styled.select`
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.9rem;
  width: 100%;
`;

type DocumentRow = {
  id: string;
  name: string;
  file_path: string;
  file_type: string | null;
  updated_at: string | null;
  created_at?: string | null;
  job_application_id?: string | null;
};

type DocumentView = DocumentRow & { signed_url?: string };

export const Documents: FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  // const navigate = useNavigate(); // re-enable when navigation from modal is implemented
  const [rows, setRows] = useState<DocumentView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [apps, setApps] = useState<Array<{ id: string; company_name: string; position: string }>>([]);
  const [working, setWorking] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editDoc, setEditDoc] = useState<DocumentView | null>(null);
  const [editAppId, setEditAppId] = useState<string>('');

  const formatDateOnly = (s?: string | null) => s ? new Date(s).toLocaleDateString() : '-';
  const positionById = (id?: string | null) => {
    if (!id) return '-';
    const f = apps.find(a => a.id === id);
    return f ? f.position : '-';
  };

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const [{ data, error }, appsRes] = await Promise.all([
      supabase
        .from('documents')
        .select('id, name, file_path, file_type, updated_at, created_at, job_application_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('job_applications')
        .select('id, company_name, position')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ]);
    if (error) {
      setError(error.message);
      setRows([]);
      setLoading(false);
      return;
    }
    if (!appsRes.error && appsRes.data) setApps((appsRes.data as Array<{ id: string; company_name: string; position: string }>) || []);
    const base: DocumentRow[] = ((data || []) as DocumentRow[]);

    try {
      const prefix = `${user.id}`;
      const { data: objList, error: listErr } = await supabase.storage.from('documents').list(prefix, { limit: 100 });
      if (!listErr && Array.isArray(objList)) {
        const existing = new Set(base.map(d => d.file_path));
        const toInsert: Array<{ user_id: string; name: string; file_path: string; file_type: string | null }>= [];
        for (const obj of objList) {
          if (!obj || !obj.name) continue;
          const path = `${prefix}/${obj.name}`;
          if (!existing.has(path)) {
            const ext = obj.name.includes('.') ? obj.name.split('.').pop()!.toUpperCase() : null;
            toInsert.push({ user_id: user.id, name: obj.name, file_path: path, file_type: ext });
          }
        }
        if (toInsert.length > 0) {
          await supabase.from('documents').insert(toInsert);
          const { data: data2 } = await supabase
            .from('documents')
            .select('id, name, file_path, file_type, updated_at, created_at, job_application_id')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (data2) {
            base.splice(0, base.length, ...((data2 as DocumentRow[]) || []));
          }
        }
      }
    } catch {
      // ignore reconciliation errors; will attempt again on next refresh
    }

    const withUrls: DocumentView[] = await Promise.all(base.map(async (d) => {
      const { data: signed, error: signErr } = await supabase
        .storage
        .from('documents')
        .createSignedUrl(d.file_path, 60 * 60);
      return { ...d, signed_url: signErr ? undefined : signed?.signedUrl };
    }));
    setRows(withUrls);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [user, refresh]);

  const handleChooseFiles = () => fileInputRef.current?.click();

  // linkDocument is now handled in the Edit modal

  const deleteDocument = async (doc: DocumentView) => {
    if (!user) return;
    const ok = confirm(`Delete ${doc.name}?`);
    if (!ok) return;
    setWorking(true);
    const [delObj, delRow] = await Promise.all([
      supabase.storage.from('documents').remove([doc.file_path]),
      supabase.from('documents').delete().eq('id', doc.id).eq('user_id', user.id)
    ]);
    setWorking(false);
    if (delObj?.error || delRow?.error) {
      alert(delObj?.error?.message || delRow?.error?.message || 'Failed to delete');
      return;
    }
    await refresh();
  };

  const openEdit = (doc: DocumentView) => {
    setEditDoc(doc);
    setEditAppId(doc.job_application_id || '');
    setShowEdit(true);
  };

  const saveEdit = async () => {
    if (!user || !editDoc) return;
    setWorking(true);
    await supabase.from('documents')
      .update({ job_application_id: editAppId || null })
      .eq('id', editDoc.id)
      .eq('user_id', user.id);
    setWorking(false);
    setShowEdit(false);
    setEditDoc(null);
    await refresh();
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() || '';
        const objectPath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from('documents').upload(objectPath, file, { contentType: file.type || 'application/octet-stream', cacheControl: '3600', upsert: false });
        if (uploadErr) throw uploadErr;
        await supabase.from('documents').insert({
          user_id: user.id,
          name: file.name,
          file_path: objectPath,
          file_type: ext.toUpperCase(),
          file_size: file.size,
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
    } finally {
      await refresh();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <DocumentsContainer>
      <Header>{t('nav.documents')}</Header>
      <UploadArea>
        <UploadIcon>📁</UploadIcon>
        <UploadTitle>Drag & drop files here</UploadTitle>
        <UploadText>or click the button below to upload documents</UploadText>
        <UploadButton onClick={handleChooseFiles} disabled={working}>Select Files</UploadButton>
        <input ref={fileInputRef} type="file" multiple accept="*/*" style={{ display: 'none' }} onChange={handleFilesSelected} />
      </UploadArea>

      <DocumentsListContainer>
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Name</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Position</TableHeader>
                <TableHeader>Last Updated</TableHeader>
                <TableHeader style={{ textAlign: 'right' }}>Actions</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow><TableCell colSpan={5}>Loading…</TableCell></TableRow>
              )}
              {error && !loading && (
                <TableRow><TableCell colSpan={5} style={{ color: '#f87171' }}>Error: {error}</TableCell></TableRow>
              )}
              {!loading && !error && rows.length === 0 && (
                <TableRow><TableCell colSpan={5}>No documents.</TableCell></TableRow>
              )}
              {!loading && !error && rows.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <DocumentName>
                      <DocumentIcon>📄</DocumentIcon>
                      <DocumentLink href={doc.signed_url || '#'} target={doc.signed_url ? '_blank' : undefined} rel={doc.signed_url ? 'noopener noreferrer' : undefined}>{doc.name}</DocumentLink>
                    </DocumentName>
                  </TableCell>
                  <TableCell>
                    <DocumentType>{doc.file_type ?? 'file'}</DocumentType>
                  </TableCell>
                  <TableCell>{positionById(doc.job_application_id)}</TableCell>
                  <TableCell>{formatDateOnly(doc.updated_at ?? doc.created_at)}</TableCell>
                  <TableCell>
                    <Actions>
                      <ActionButton onClick={() => openEdit(doc)} disabled={working}>Edit</ActionButton>
                    </Actions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <MobileDocumentsList>
          {rows.map(doc => (
            <DocumentCard key={doc.id}>
              <DocumentCardHeader>
                <DocumentIcon>📄</DocumentIcon>
                <DocumentCardTitle>
                  <DocumentCardName href={doc.signed_url || '#'} target={doc.signed_url ? '_blank' : undefined} rel={doc.signed_url ? 'noopener noreferrer' : undefined}>{doc.name}</DocumentCardName>
                  <DocumentCardType>{doc.file_type ?? 'file'}</DocumentCardType>
                </DocumentCardTitle>
              </DocumentCardHeader>
              <DocumentCardDetails>
                <DocumentDetail>
                  <DocumentDetailLabel>Position</DocumentDetailLabel>
                  <DocumentDetailValue>{positionById(doc.job_application_id)}</DocumentDetailValue>
                </DocumentDetail>
                <DocumentDetail>
                  <DocumentDetailLabel>Last Updated</DocumentDetailLabel>
                  <DocumentDetailValue>{formatDateOnly(doc.updated_at ?? doc.created_at)}</DocumentDetailValue>
                </DocumentDetail>
              </DocumentCardDetails>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <ActionButton onClick={() => openEdit(doc)} disabled={working}>Edit</ActionButton>
              </div>
            </DocumentCard>
          ))}
        </MobileDocumentsList>
      </DocumentsListContainer>

      {(!loading && !error && rows.length === 0) && (
        <EmptyStateContainer>
          <EmptyStateTitle>No more documents found</EmptyStateTitle>
          <EmptyStateText>Upload more documents to keep your job search organized.</EmptyStateText>
        </EmptyStateContainer>
      )}

      {showEdit && editDoc && (
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Edit Document</ModalTitle>
            <ModalRow>
              <div>
                <Label htmlFor="e-app">Position (link to application)</Label>
                <Select id="e-app" value={editAppId} onChange={(e) => setEditAppId(e.target.value)}>
                  <option value="">None</option>
                  {apps.map(a => (
                    <option key={a.id} value={a.id}>{a.company_name} — {a.position}</option>
                  ))}
                </Select>
              </div>
            </ModalRow>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <ActionButton onClick={() => deleteDocument(editDoc!)} disabled={working}>Delete</ActionButton>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <ActionButton onClick={() => { setShowEdit(false); setEditDoc(null); }} disabled={working}>Cancel</ActionButton>
                <ActionButton onClick={saveEdit} disabled={working}>Save</ActionButton>
              </div>
            </div>
          </ModalCard>
        </ModalBackdrop>
      )}
    </DocumentsContainer>
  );
};

export default Documents;