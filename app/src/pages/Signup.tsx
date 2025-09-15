import type { FC, FormEvent, ChangeEvent } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

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

const LinksRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
	@media (max-width: 380px) {
		flex-direction: column;
		align-items: stretch;
		gap: 0.4rem;
	}
`;

const LinkButton = styled.a`
	color: #c7d2fe;
	text-decoration: none;
	font-weight: 600;
	font-size: 0.95rem;
	:hover { text-decoration: underline; }
`;

export const Signup: FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const nextErrors: { name?: string; email?: string; password?: string } = {};
		if (!name.trim()) nextErrors.name = 'Please enter your name.';
		if (!email.includes('@')) nextErrors.email = 'Please enter a valid email.';
		if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length === 0) alert('Account created (demo)');
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
					<Form onSubmit={onSubmit} aria-labelledby="signup-title">
						<Field>
							<Icon>👤</Icon>
							<Input id="name" name="name" type="text" onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} aria-invalid={!!errors.name} />
							<FloatingLabel htmlFor="name" $active={!!name}>Full name</FloatingLabel>
							{errors.name && <ErrorText role="alert">{errors.name}</ErrorText>}
						</Field>
						<Field>
							<Icon>✉️</Icon>
							<Input id="email" name="email" type="email" onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
							<FloatingLabel htmlFor="email" $active={!!email}>Email</FloatingLabel>
							{errors.email && <ErrorText role="alert">{errors.email}</ErrorText>}
						</Field>
						<Field>
							<Icon>🔒</Icon>
							<Input id="password" name="password" type="password" onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} aria-invalid={!!errors.password} />
							<FloatingLabel htmlFor="password" $active={!!password}>Password</FloatingLabel>
							{errors.password && <ErrorText role="alert">{errors.password}</ErrorText>}
						</Field>
						<Submit type="submit">Create account</Submit>
					</Form>
					<LinksRow>
						<LinkButton href="/signin">Already have an account?</LinkButton>
					</LinksRow>
				</Card>
			</Shell>
			<Footer />
		</Wrapper>
	);
};

export default Signup; 