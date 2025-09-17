import type { FC } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { PublicNavbar } from '../components/PublicNavbar';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  display: flex;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex: 1;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
  
  @media (max-width: 320px) {
    padding: 0.5rem;
  }
`;

const HeroSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 2rem;
  color: white;
  max-width: 50%;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding-right: 0;
    padding-bottom: 2rem;
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    padding-bottom: 1rem;
  }
  
  @media (max-width: 320px) {
    padding-bottom: 0.5rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 500px;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 50%;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 3rem;
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 320px) {
    padding: 1rem;
  }
  
  @media (max-width: 280px) {
    padding: 0.75rem;
  }
`;

const Title = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
  }
  
  @media (max-width: 768px) {
    padding: 0.65rem 0.9rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 320px) {
    padding: 0.5rem 0.7rem;
    font-size: 0.85rem;
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.65rem;
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 320px) {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
  
  span {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
  margin: 1.5rem 0 0;
`;

const FooterLink = styled(Link)`
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
`;

const ForgotPasswordLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  text-align: right;
  margin-top: 0.25rem;
  
  &:hover {
    color: white;
    text-decoration: underline;
  }
`;

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Type guard to check if error is an Error object
      if (error instanceof Error) {
        setError(error.message || 'Failed to sign in');
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PublicNavbar />
      <ContentWrapper>
        <HeroSection>
          <HeroTitle>Your job search, organized.</HeroTitle>
          <HeroDescription>Move fast with reminders, documents, and a simple board that shows exactly where every application stands.</HeroDescription>
        </HeroSection>
        <FormContainer>
          <Card>
            <Title>Sign in</Title>
        
        {error && <ErrorText>{error}</ErrorText>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <ForgotPasswordLink href="#">Forgot password?</ForgotPasswordLink>
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Form>
        
        <Divider>
          <span>or</span>
        </Divider>
        
        <FooterText>
          Don't have an account? <FooterLink to="/signup">Create account</FooterLink>
        </FooterText>
        
        <FooterText style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
          We protect your data according to GDPR and industry best practices.
        </FooterText>
      </Card>
    </FormContainer>
  </ContentWrapper>
</PageContainer>
  );
};

export default Login;