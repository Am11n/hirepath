import type { FC } from 'react';
import styled from 'styled-components';
import { useThemeMode } from '../contexts/themeMode';
import { useI18n } from '../contexts/I18nProvider';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  overflow-x: hidden; /* prevent horizontal scroll on mobile */
  
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

const Section = styled.section`
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  border: 1px solid ${props => props.theme.colors.borders};
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

const SectionHeader = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  
  @media (min-width: 480px) {
    font-size: 1.375rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 480px) {
    gap: 1.25rem;
  }
  
  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  
  @media (min-width: 480px) {
    gap: 0.5rem;
  }
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem 1rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Inline = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SectionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem 1.25rem;
  }
  @media (min-width: 1024px) {
    gap: 1.5rem;
  }
`;

// Narrow three-across layout for password fields
const PasswordRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const PasswordItem = styled.div`
  flex: 1 1 220px;
  max-width: 320px;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
  font-weight: 500;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Input = styled.input`
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.9rem;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
    border-color: ${props => props.theme.colors.primary};
  }
  
  @media (min-width: 480px) {
    padding: 0.7rem;
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.75rem;
    font-size: 1rem;
  }
`;

const Select = styled.select`
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.95rem;
  &:focus { outline: 2px solid ${props => props.theme.colors.primary}; outline-offset: 2px; }
`;

const Textarea = styled.textarea`
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 10px;
  padding: 0.7rem;
  font-size: 0.95rem;
  min-height: 110px;
  resize: vertical;
  &:focus { outline: 2px solid ${props => props.theme.colors.primary}; outline-offset: 2px; }
`;

const Button = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
  width: 100%;
  
  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.25);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (min-width: 480px) {
    width: auto;
    padding: 0.65rem 1.3rem;
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 10px;
  }
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
  transition: all 0.2s ease;
  align-self: flex-start;
`;

const DangerButton = styled.button`
  background: ${props => props.theme.colors.error};
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
    background: #dc2626;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.error}, 0 8px 24px rgba(0,0,0,.25);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.error};
    outline-offset: 2px;
  }
  
  @media (min-width: 480px) {
    width: auto;
    padding: 0.65rem 1.3rem;
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 10px;
  }
`;

const DescriptionText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const AvatarCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border: 1px solid ${props => props.theme.colors.borders};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
`;

const UploadInfo = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.85rem;
`;

const AvatarWrap = styled.div`
  position: relative;
  display: inline-flex;
`;

const AvatarMenu = styled.div`
  position: absolute;
  top: 84px;
  left: 0;
  background: ${props => props.theme.glass.dropdown};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  min-width: 180px;
  z-index: 20;
  overflow: hidden;
`;

const AvatarMenuItem = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  padding: 0.6rem 0.8rem;
  color: ${props => props.theme.colors.headings};
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.06); }
`;

export const Profile: FC = () => {
  const { mode, setMode, fontScale, setFontScale, accent, setAccent } = useThemeMode();
  const { setLang, t } = useI18n();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [language, setLanguage] = useState('English');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarWrapRef = useRef<HTMLDivElement>(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      // Load profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();
      if (prof?.full_name && typeof prof.full_name === 'string') {
        const parts = (prof.full_name as string).trim().split(' ');
        if (!firstName) setFirstName(parts[0] || '');
        if (!lastName) setLastName(parts.slice(1).join(' ') || '');
      }
      // Load metadata
      const meta = user.user_metadata as Record<string, unknown> | undefined;
      if (meta?.first_name) setFirstName(String(meta.first_name));
      if (meta?.last_name) setLastName(String(meta.last_name));
      if (meta?.language) {
        const l = String(meta.language);
        setLanguage(l);
        // Try to map friendly label -> code
        if (l.toLowerCase().startsWith('nor')) setLang('nb');
        else setLang('en');
      }
      if (meta?.avatar_url) setAvatarUrl(String(meta.avatar_url));
    };
    load();
  }, [user]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element)) return;
      if (avatarWrapRef.current && !avatarWrapRef.current.contains(e.target)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      const full_name = `${firstName || ''} ${lastName || ''}`.trim();
      const { error: upsertErr } = await supabase
        .from('profiles')
        .upsert({ id: user.id, full_name, updated_at: new Date().toISOString() }, { onConflict: 'id' });
      if (upsertErr) throw upsertErr;
      const { error: metaErr } = await supabase.auth.updateUser({ data: { first_name: firstName, last_name: lastName, language } });
      if (metaErr) throw metaErr;
      // Apply language to i18n provider immediately
      setLang(language === 'Norwegian' ? 'nb' : 'en');
      setSaveOk(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('profile.saveFailed');
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChooseAvatar = () => fileInputRef.current?.click();

  const handleAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarError(t('profile.selectImageFile'));
      return;
    }
    setAvatarError(null);
    setAvatarSaving(true);

    try {
      const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'jpg';
      // Upload into a dedicated avatars bucket so it won't appear in Documents
      const objectPath = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(objectPath, file, { contentType: file.type, upsert: true, cacheControl: '3600' });
      if (upErr) throw upErr;

      const { data: signed, error: signErr } = await supabase.storage
        .from('avatars')
        .createSignedUrl(objectPath, 60 * 60 * 24 * 7); // 7 days
      if (signErr) throw signErr;

      const url = signed?.signedUrl || null;
      setAvatarUrl(url);
      const { error: metaErr } = await supabase.auth.updateUser({ data: { avatar_url: url, avatar_path: objectPath, first_name: firstName, last_name: lastName } });
      if (metaErr) throw metaErr;
      setAvatarMenuOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('profile.uploadFailed');
      setAvatarError(message);
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    try {
      const meta = user.user_metadata as Record<string, unknown> | undefined;
      const avatarPath = meta && typeof meta.avatar_path === 'string' ? (meta.avatar_path as string) : null;
      if (avatarPath) {
        await supabase.storage.from('avatars').remove([avatarPath]);
      }
      const { error: metaErr } = await supabase.auth.updateUser({ data: { avatar_url: null, avatar_path: null } });
      if (metaErr) throw metaErr;
      setAvatarUrl(null);
      setAvatarMenuOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('profile.removeAvatarFailed');
      setAvatarError(message);
    }
  };

  return (
    <ProfileContainer>
      <Header>{t('profile.title')}</Header>
      <SectionsGrid>
      <Section>
        <SectionHeader>{t('profile.sections.profile')}</SectionHeader>
        <Form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
          <FormGroup>
            <Label>{t('profile.picture')}</Label>
            <AvatarRow>
              <AvatarWrap ref={avatarWrapRef}>
                <AvatarCircle onClick={() => setAvatarMenuOpen(v => !v)} style={{ cursor:'pointer' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (user?.email?.charAt(0).toUpperCase() || 'U')
                  )}
                </AvatarCircle>
                {avatarMenuOpen && (
                  <AvatarMenu onClick={(e)=>e.stopPropagation()}>
                    <AvatarMenuItem type='button' onClick={handleChooseAvatar} disabled={avatarSaving}>{t('profile.chooseImage')}</AvatarMenuItem>
                    {avatarUrl && (
                      <AvatarMenuItem type='button' onClick={handleRemoveAvatar} disabled={avatarSaving}>{t('profile.removeImage')}</AvatarMenuItem>
                    )}
                  </AvatarMenu>
                )}
              </AvatarWrap>
              <input ref={fileInputRef} id="avatar" type="file" accept="image/*" onChange={handleAvatarSelected} style={{ display: 'none' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <UploadInfo>{t('profile.avatarInstructions')}</UploadInfo>
                {avatarSaving && <UploadInfo>{t('profile.uploading')}</UploadInfo>}
                {avatarError && <span style={{ color: '#f87171' }}>{avatarError}</span>}
              </div>
            </AvatarRow>
          </FormGroup>
          <TwoCol>
            <FormGroup>
              <Label htmlFor='first-name'>{t('profile.firstName')}</Label>
              <Input id='first-name' placeholder={t('profile.firstName')} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor='last-name'>{t('profile.lastName')}</Label>
              <Input id='last-name' placeholder={t('profile.lastName')} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </FormGroup>
          </TwoCol>
          <PasswordRow>
            <PasswordItem>
              <FormGroup>
                <Label htmlFor='old-password'>{t('profile.oldPassword')}</Label>
                <Input
                  type="password"
                  id="old-password"
                  name="old-password"
                  placeholder={t('profile.enterOldPassword')}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={oldPassword}
                  onChange={(e)=>setOldPassword(e.target.value)}
                />
              </FormGroup>
            </PasswordItem>
            <PasswordItem>
              <FormGroup>
                <Label htmlFor='new-password'>{t('profile.newPassword')}</Label>
                <Input
                  type="password"
                  id="new-password"
                  name="new-password"
                  placeholder={t('profile.enterNewPassword')}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e)=>setNewPassword(e.target.value)}
                />
              </FormGroup>
            </PasswordItem>
            <PasswordItem>
              <FormGroup>
                <Label htmlFor='confirm-password'>{t('profile.confirmPassword')}</Label>
                <Input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  placeholder={t('profile.confirmNewPassword')}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                />
              </FormGroup>
            </PasswordItem>
          </PasswordRow>
          <FormGroup>
            <Label htmlFor='language'>{t('profile.language')}</Label>
            <Select id="language" value={language} onChange={(e) => { const v = e.target.value; setLanguage(v); setLang(v === 'Norwegian' ? 'nb' : 'en'); }}>
              <option>English</option>
              <option>Norwegian</option>
            </Select>
          </FormGroup>
          <Button type='submit' disabled={saving}>{saving ? t('profile.saving') : t('profile.saveProfile')}</Button>
          {saveOk && <span style={{ color: '#10b981' }}>{t('profile.saved')}</span>}
          {saveError && <span style={{ color: '#f87171' }}>{t('common.error')}: {saveError}</span>}
        </Form>
      </Section>
       
      <Section>
        <SectionHeader>{t('profile.sections.notifications')}</SectionHeader>
        <Form>
          <FormGroup>
            <Label><Input type='checkbox' /> {t('profile.emailNotifications')}</Label>
          </FormGroup>
          <FormGroup>
            <Label><Input type='checkbox' /> {t('profile.pushNotifications')}</Label>
          </FormGroup>
          <FormGroup>
            <Label><Input type='checkbox' /> {t('profile.weeklySummary')}</Label>
          </FormGroup>
          <FormGroup>
            <Label>{t('profile.deliveryPreference')}</Label>
            <Inline>
              <label><Input type='radio' name='notifPref' defaultChecked /> {t('profile.onlyImportant')}</label>
              <label><Input type='radio' name='notifPref' /> {t('profile.allUpdates')}</label>
            </Inline>
          </FormGroup>
          <Button type='button'>{t('profile.saveNotifications')}</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>{t('profile.sections.preferences')}</SectionHeader>
        <Form>
          <TwoCol>
            <FormGroup>
              <Label htmlFor='default-view'>{t('profile.defaultView')}</Label>
              <Select id="default-view">
                <option>Kanban</option>
                <option>List</option>
                <option>Timeline</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor='reminder-time'>{t('profile.reminderTime')}</Label>
              <Select id="reminder-time">
                <option>24 hours before</option>
                <option>12 hours before</option>
                <option>2 hours before</option>
              </Select>
            </FormGroup>
          </TwoCol>
          <TwoCol>
            <FormGroup>
              <Label htmlFor='timezone'>{t('profile.timezone')}</Label>
              <Select id="timezone">
                <option>UTC</option>
                <option>Europe/Oslo</option>
                <option>America/New_York</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor='working-hours'>{t('profile.workingHours')}</Label>
              <Input id="working-hours" placeholder="09:00 - 17:00" />
            </FormGroup>
          </TwoCol>
          <Button type='button'>{t('profile.savePreferences')}</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>{t('profile.sections.integrations')}</SectionHeader>
        <Inline>
          <SecondaryButton type='button'>{t('profile.connectLinkedIn')}</SecondaryButton>
          <SecondaryButton type='button'>{t('profile.connectGoogleDrive')}</SecondaryButton>
          <SecondaryButton type='button'>{t('profile.connectDropbox')}</SecondaryButton>
          <SecondaryButton type='button'>{t('profile.exportCSV')}</SecondaryButton>
          <SecondaryButton type='button'>{t('profile.exportPDF')}</SecondaryButton>
        </Inline>
      </Section>
      
      <Section>
        <SectionHeader>{t('profile.sections.theme')}</SectionHeader>
        <Form>
          <FormGroup>
            <Label>{t('profile.mode')}</Label>
            <Inline>
              <label><Input type='radio' name='mode' checked={mode === 'light'} onChange={() => setMode('light')} /> {t('profile.light')}</label>
              <label><Input type='radio' name='mode' checked={mode === 'dark'} onChange={() => setMode('dark')} /> {t('profile.dark')}</label>
            </Inline>
          </FormGroup>
          <FormGroup>
            <Label>{t('profile.accentColor')}</Label>
            <Inline>
              <label><Input type='radio' name='accent' checked={accent === 'blue'} onChange={() => setAccent('blue')} /> {t('profile.blue')}</label>
              <label><Input type='radio' name='accent' checked={accent === 'purple'} onChange={() => setAccent('purple')} /> {t('profile.purple')}</label>
              <label><Input type='radio' name='accent' checked={accent === 'green'} onChange={() => setAccent('green')} /> {t('profile.green')}</label>
            </Inline>
          </FormGroup>
          <FormGroup>
            <Label htmlFor='font-size'>{t('profile.fontSize')}</Label>
            <Select id="font-size" value={fontScale === 'normal' ? 'Normal' : fontScale === 'large' ? 'Large' : 'Extra Large'} onChange={(e) => {
              const val = e.target.value;
              if (val === 'Normal') setFontScale('normal');
              else if (val === 'Large') setFontScale('large');
              else setFontScale('xlarge');
            }}>
              <option>Normal</option>
              <option>Large</option>
              <option>Extra Large</option>
            </Select>
          </FormGroup>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>{t('profile.sections.privacy')}</SectionHeader>
        <Form>
          <FormGroup>
            <Label><Input type='checkbox' /> {t('profile.enable2FA')}</Label>
          </FormGroup>
          <FormGroup>
            <Label>{t('profile.activeSessions')}</Label>
            <DescriptionText>{t('profile.session1')}</DescriptionText>
            <DescriptionText>{t('profile.session2')}</DescriptionText>
            <SecondaryButton type='button'>{t('profile.signOutSessions')}</SecondaryButton>
          </FormGroup>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>{t('profile.sections.subscription')}</SectionHeader>
        <DescriptionText>{t('profile.currentPlan')}</DescriptionText>
        <Inline>
          <SecondaryButton type='button'>{t('profile.upgrade')}</SecondaryButton>
          <SecondaryButton type='button'>{t('profile.manageBilling')}</SecondaryButton>
        </Inline>
      </Section>
      
      <Section>
        <SectionHeader>{t('profile.sections.support')}</SectionHeader>
        <Inline>
          <SecondaryButton as='a' href='/help' style={{ textDecoration: 'none' }}>{t('profile.helpCenter')}</SecondaryButton>
          <SecondaryButton type='button'>{t('profile.contactSupport')}</SecondaryButton>
        </Inline>
        <Form style={{ marginTop: '0.75rem' }}>
          <FormGroup>
            <Label htmlFor='feedback'>{t('profile.feedback')}</Label>
            <Textarea id='feedback' placeholder={t('profile.feedbackPlaceholder')} />
          </FormGroup>
          <Button type='button'>{t('profile.sendFeedback')}</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>{t('profile.sections.danger')}</SectionHeader>
        <DescriptionText>
          {t('profile.deleteWarning')}
        </DescriptionText>
        <DangerButton>{t('profile.deleteAccount')}</DangerButton>
      </Section>
      </SectionsGrid>
    </ProfileContainer>
  );
};

export default Profile;