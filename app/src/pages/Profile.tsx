import type { FC } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.h1`
  color: ${props => props.theme.colors.headings};
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const SectionHeader = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
  
  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const DangerButton = styled.button`
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #dc2626;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.error}, 0 8px 24px rgba(0,0,0,.35);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.error};
    outline-offset: 2px;
  }
`;

const DescriptionText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  margin-bottom: 1.5rem;
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