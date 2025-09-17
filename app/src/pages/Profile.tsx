import type { FC } from 'react';
import styled from 'styled-components';

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

const Section = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
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
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
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
    box-shadow: 0 0 0 2px ${props => props.theme.colors.error}, 0 8px 24px rgba(0,0,0,.35);
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
  return (
    <ProfileContainer>
      <Header>Profile</Header>
      
      <Section>
        <SectionHeader>Account Information</SectionHeader>
        <Form>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input type="text" id="name" placeholder="Enter your full name" />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input type="email" id="email" placeholder="Enter your email" />
          </FormGroup>
          
          <Button type="submit">Save Changes</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Notifications</SectionHeader>
        <Form>
          <FormGroup>
            <Label>
              <Input type="checkbox" /> Email notifications for new applications
            </Label>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Input type="checkbox" /> Email notifications for interview reminders
            </Label>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Input type="checkbox" /> Email notifications for document updates
            </Label>
          </FormGroup>
          
          <Button type="submit">Save Preferences</Button>
        </Form>
      </Section>
      
      <Section>
        <SectionHeader>Security</SectionHeader>
        <Form>
          <FormGroup>
            <Label htmlFor="current-password">Current Password</Label>
            <Input type="password" id="current-password" placeholder="Enter current password" />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="new-password">New Password</Label>
            <Input type="password" id="new-password" placeholder="Enter new password" />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input type="password" id="confirm-password" placeholder="Confirm new password" />
          </FormGroup>
          
          <Button type="submit">Update Password</Button>
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