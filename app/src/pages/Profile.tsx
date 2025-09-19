import type { FC } from 'react';
import styled from 'styled-components';
import { useThemeMode } from '../contexts/themeMode';

const ProfileContainer = styled.div`
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

export const Profile: FC = () => {
  const { mode, setMode } = useThemeMode();

  return (
    <ProfileContainer>
      <Header>Settings</Header>
      
      <Section>
        <SectionHeader>Profile Settings</SectionHeader>
        <Form>
          <TwoCol>
            <FormGroup>
              <Label htmlFor="full-name">Full Name</Label>
              <Input type="text" id="full-name" placeholder="Your name" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input type="text" id="username" placeholder="unique-username" />
            </FormGroup>
          </TwoCol>
          <FormGroup>
            <Label htmlFor="avatar">Profile Picture</Label>
            <Input type="file" id="avatar" accept="image/*" />
          </FormGroup>
          <TwoCol>
            <FormGroup>
              <Label htmlFor="new-password">New Password</Label>
              <Input type="password" id="new-password" placeholder="Enter new password" />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input type="password" id="confirm-password" placeholder="Confirm new password" />
            </FormGroup>
          </TwoCol>
          <FormGroup>
            <Label htmlFor="language">Language</Label>
            <Select id="language">
              <option>English</option>
              <option>Norsk</option>
              <option>Deutsch</option>
            </Select>
          </FormGroup>
          <Button type="button">Save Profile</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Notifications</SectionHeader>
        <Form>
          <FormGroup>
            <Label><Input type="checkbox" /> Email Notifications</Label>
          </FormGroup>
          <FormGroup>
            <Label><Input type="checkbox" /> Push/Browser Notifications</Label>
          </FormGroup>
          <FormGroup>
            <Label><Input type="checkbox" /> Weekly Job Summary Emails</Label>
          </FormGroup>
          <FormGroup>
            <Label>Delivery Preference</Label>
            <Inline>
              <label><Input type="radio" name="notifPref" defaultChecked /> Only important</label>
              <label><Input type="radio" name="notifPref" /> All updates</label>
            </Inline>
          </FormGroup>
          <Button type="button">Save Notification Settings</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Application Preferences</SectionHeader>
        <Form>
          <TwoCol>
            <FormGroup>
              <Label htmlFor="default-view">Default view</Label>
              <Select id="default-view">
                <option>Kanban</option>
                <option>List</option>
                <option>Timeline</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="reminder-time">Default reminder time</Label>
              <Select id="reminder-time">
                <option>24 hours before</option>
                <option>12 hours before</option>
                <option>2 hours before</option>
              </Select>
            </FormGroup>
          </TwoCol>
          <TwoCol>
            <FormGroup>
              <Label htmlFor="timezone">Timezone</Label>
              <Select id="timezone">
                <option>UTC</option>
                <option>Europe/Oslo</option>
                <option>America/New_York</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="working-hours">Working hours</Label>
              <Input id="working-hours" placeholder="09:00 - 17:00" />
            </FormGroup>
          </TwoCol>
          <Button type="button">Save Preferences</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Integrations</SectionHeader>
        <Inline>
          <SecondaryButton type="button">Connect LinkedIn</SecondaryButton>
          <SecondaryButton type="button">Connect Google Drive</SecondaryButton>
          <SecondaryButton type="button">Connect Dropbox</SecondaryButton>
          <SecondaryButton type="button">Export CSV</SecondaryButton>
          <SecondaryButton type="button">Export PDF</SecondaryButton>
        </Inline>
      </Section>
      
      <Section>
        <SectionHeader>Theme & Appearance</SectionHeader>
        <Form>
          <FormGroup>
            <Label>Mode</Label>
            <Inline>
              <label><Input type="radio" name="mode" checked={mode === 'light'} onChange={() => setMode('light')} /> Light</label>
              <label><Input type="radio" name="mode" checked={mode === 'dark'} onChange={() => setMode('dark')} /> Dark</label>
            </Inline>
          </FormGroup>
          <FormGroup>
            <Label>Accent color</Label>
            <Inline>
              <label><Input type="radio" name="accent" defaultChecked /> Blue</label>
              <label><Input type="radio" name="accent" /> Purple</label>
              <label><Input type="radio" name="accent" /> Green</label>
            </Inline>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="font-size">Font size</Label>
            <Select id="font-size">
              <option>Normal</option>
              <option>Large</option>
              <option>Extra Large</option>
            </Select>
          </FormGroup>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Privacy & Security</SectionHeader>
        <Form>
          <FormGroup>
            <Label><Input type="checkbox" /> Enable Two‑Factor Authentication (2FA)</Label>
          </FormGroup>
          <FormGroup>
            <Label>Active sessions</Label>
            <DescriptionText>Mac • Chrome • Oslo · Active now</DescriptionText>
            <DescriptionText>iPhone • Safari • Last active 2d ago</DescriptionText>
            <SecondaryButton type="button">Sign out of all other sessions</SecondaryButton>
          </FormGroup>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Subscription / Account Plan</SectionHeader>
        <DescriptionText>Current plan: Free • 12 applications tracked • 4 documents uploaded</DescriptionText>
        <Inline>
          <SecondaryButton type="button">Upgrade</SecondaryButton>
          <SecondaryButton type="button">Manage Billing</SecondaryButton>
        </Inline>
      </Section>
      
      <Section>
        <SectionHeader>Support</SectionHeader>
        <Inline>
          <SecondaryButton as="a" href="/help" style={{ textDecoration: 'none' }}>Help Center</SecondaryButton>
          <SecondaryButton type="button">Contact Support</SecondaryButton>
        </Inline>
        <Form style={{ marginTop: '0.75rem' }}>
          <FormGroup>
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea id="feedback" placeholder="What can we improve?" />
          </FormGroup>
          <Button type="button">Send Feedback</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Danger Zone</SectionHeader>
        <DescriptionText>
          Permanently delete your account and all associated data. This action cannot be undone.
        </DescriptionText>
        <DangerButton>Delete Account</DangerButton>
      </Section>
    </ProfileContainer>
  );
};

export default Profile;