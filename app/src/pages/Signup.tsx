import type { FC, ChangeEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

const Wrapper = styled.main`
	min-height: 100vh;
	background: radial-gradient(60% 80% at 20% 20%, rgba(67,56,202,0.25) 0%, rgba(15,23,42,0.0) 60%),
		linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
	color: #ffffff;
	display: flex;
	flex-direction: column;
`;

const Shell = styled.div`
	max-width: 1100px;
	margin: 0 auto;
	padding: calc(4rem + env(safe-area-inset-top)) 0.75rem calc(2.25rem + env(safe-area-inset-bottom)) 0.75rem;
	flex: 1 0 auto;
	display: grid;
	gap: 1.5rem;
	grid-template-columns: 1fr;
	align-items: center;
	@media (min-width: 640px) {
		padding: 5rem 1rem 3rem 1rem;
		gap: 2rem;
	}
	@media (min-width: 1024px) {
		grid-template-columns: 1fr 480px;
	}
`;

const Pitch = styled.section`
	display: none;
	@media (min-width: 1024px) {
		display: grid;
		gap: 0.75rem;
		align-content: center;
	}
`;

const PitchTitle = styled.h1`
	margin: 0;
	font-size: clamp(1.8rem, 3.5vw, 2.6rem);
	font-weight: 800;
`;

const PitchText = styled.p`
	margin: 0;
	color: #cbd5e1;
	max-width: 52ch;
`;

const Card = styled.div`
	margin: 0 auto;
	width: 100%;
	max-width: min(480px, calc(100vw - 2rem));
	box-sizing: border-box;
	background: #0f1a33;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	box-shadow: 0 20px 60px rgba(0,0,0,0.35);
	padding: 1.25rem;
	display: grid;
	gap: 1rem;
	@media (min-width: 640px) {
		padding: 1.5rem;
		max-width: 480px;
	}
`;

const Title = styled.h2`
	margin: 0;
	font-size: clamp(1.6rem, 3vw, 2rem);
	font-weight: 800;
	text-align: center;
`;

const Lead = styled.p`
	margin: 0;
	color: #cbd5e1;
	text-align: center;
`;

const Form = styled.form`
	display: grid;
	gap: 0.9rem;
`;

const Field = styled.div`
	position: relative;
`;

const Icon = styled.span`
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 14px;
	color: #94a3b8;
	pointer-events: none;
`;

const FloatingLabel = styled.label<{ $active: boolean }>`
	position: absolute;
	left: 36px;
	top: ${p => (p.$active ? '6px' : '50%')};
	transform: translateY(${p => (p.$active ? '0' : '-50%')});
	font-size: ${p => (p.$active ? '11px' : '14px')};
	color: #94a3b8;
	transition: all 0.15s ease;
	pointer-events: none;
`;

const Input = styled.input`
	box-sizing: border-box;
	max-width: 100%;
	width: 100%;
	padding: 0.9rem 0.8rem 0.7rem 36px;
	border-radius: 12px;
	border: 1px solid rgba(255,255,255,0.15);
	background: #0b1220;
	color: #e5e7eb;
	font-size: 16px;
	:focus-visible { outline: 2px solid #4338ca; outline-offset: 2px; }
`;

const ErrorText = styled.p`
	margin: 0.25rem 0 0 0;
	font-size: 0.9rem;
	color: #ef4444;
`;

const Submit = styled.button`
	appearance: none;
	border: 0;
	border-radius: 12px;
	padding: 0.9rem 1rem;
	background: #4338ca;
	color: #ffffff;
	font-weight: 700;
	cursor: pointer;
	:focus-visible { outline: 2px solid #a5b4fc; outline-offset: 2px; }
	:hover { background: #3730a3; }
`;

const LinkButton = styled.a`
	color: #c7d2fe;
	text-decoration: none;
	font-weight: 600;
	font-size: 0.95rem;
	text-align: center;
	:hover { text-decoration: underline; }
`;

const GDPRText = styled.p`
	margin: 1.5rem 0 0 0;
	font-size: 0.8rem;
	color: #94a3b8;
	text-align: center;
`;

const Error = styled.div`
	background: rgba(220, 38, 38, 0.15);
	border: 1px solid rgba(220, 38, 38, 0.3);
	border-radius: 10px;
	padding: 0.75rem;
	color: #fecaca;
	font-size: 0.9rem;
`;

const Success = styled.div`
	background: rgba(16, 185, 129, 0.15);
	border: 1px solid rgba(16, 185, 129, 0.3);
	border-radius: 10px;
	padding: 0.75rem;
	color: #6ee7b7;
	font-size: 0.9rem;
`;

export const Signup: FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const { signUp } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess('');

		// Validate passwords match
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			setLoading(false);
			return;
		}

		try {
			const { error: signUpError } = await signUp(email, password);
			
			if (signUpError) {
				setError(signUpError.message);
			} else {
				setSuccess('Account created successfully! Please check your email for confirmation.');
				// Clear form
				setEmail('');
				setPassword('');
				setConfirmPassword('');
				// Redirect to login page after short delay
				setTimeout(() => {
					navigate('/signin');
				}, 3000);
			}
		} catch (err) {
			setError('An unexpected error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Wrapper>
			<Navbar />
			<Shell>
				<Pitch>
					<PitchTitle>Create your free account</PitchTitle>
					<PitchText>Start organizing your applications today with reminders, documents, and a clear overview.</PitchText>
				</Pitch>
				<Card>
					<Title>Sign up</Title>
					<Lead>Create your account to get started.</Lead>
					{error && <Error>{error}</Error>}
					{success && <Success>{success}</Success>}
					<Form onSubmit={handleSubmit}>
						<Field>
							<Icon>✉️</Icon>
							<Input 
								id="email" 
								name="email" 
								type="email" 
								value={email}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
								required
							/>
							<FloatingLabel htmlFor="email" $active={!!email}>Email</FloatingLabel>
						</Field>
						<Field>
							<Icon>🔒</Icon>
							<Input 
								id="password" 
								name="password" 
								type="password" 
								value={password}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
								required
							/>
							<FloatingLabel htmlFor="password" $active={!!password}>Password</FloatingLabel>
						</Field>
						<Field>
							<Icon>🔒</Icon>
							<Input 
								id="confirmPassword" 
								name="confirmPassword" 
								type="password" 
								value={confirmPassword}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} 
								required
							/>
							<FloatingLabel htmlFor="confirmPassword" $active={!!confirmPassword}>Confirm Password</FloatingLabel>
						</Field>
						<Submit type="submit" disabled={loading}>
							{loading ? 'Creating account...' : 'Create account'}
						</Submit>
					</Form>
					<GDPRText>
						By creating an account, you agree to our Terms of Service and Privacy Policy.
					</GDPRText>
					<LinkButton href="/signin">Already have an account? Sign in</LinkButton>
				</Card>
			</Shell>
			<Footer />
		</Wrapper>
	);
};

export default Signup;