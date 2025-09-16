import type { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { PublicNavbar } from '../components/PublicNavbar';
import { Footer } from '../components/Footer';

const Wrapper = styled.main`
	min-height: 100vh;
	background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
	color: #ffffff;
	display: flex;
	flex-direction: column;
`;

const Container = styled.div`
	max-width: 1100px;
	margin: 0 auto;
	padding: 5rem 1rem 3rem 1rem;
	display: grid;
	gap: 2rem;
`;

const Intro = styled.section`
	display: grid;
	gap: 0.75rem;
	text-align: left;
`;

const Title = styled.h1`
	margin: 0;
	font-size: clamp(2rem, 4.5vw, 2.75rem);
	font-weight: 800;
`;

const Lead = styled.p`
	margin: 0;
	color: #cbd5e1;
	font-size: 1.125rem;
	max-width: 70ch;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1.25rem 1.25rem;
	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`;

const popIn = keyframes`
	0% { opacity: 0; transform: translateY(8px) scale(0.98); }
	100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const Card = styled.div`
	background: #0f1a33;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	padding: 1.25rem;
	display: grid;
	grid-template-columns: 56px 1fr;
	gap: 0.85rem 1rem;
	align-items: start;
	animation: ${popIn} 320ms ease forwards;
`;

const Icon = styled.div`
	grid-row: span 2;
	width: 56px;
	height: 56px;
	border-radius: 14px;
	background: linear-gradient(180deg, #4f46e5 0%, #4338ca 100%);
	color: #ffffff;
	display: grid;
	place-items: center;
	font-size: 28px;
	box-shadow: 0 8px 20px rgba(67,56,202,0.35);
`;

const CardTitle = styled.h3`
	margin: 0;
	font-size: 1.1rem;
	font-weight: 800;
	color: #ffffff;
`;

const CardDesc = styled.p`
	margin: 0;
	color: #d1d5db;
	font-size: 0.98rem;
	line-height: 1.55;
`;

const BottomCTA = styled.section`
	padding: 2.5rem 0 3rem 0;
	text-align: center;
`;

const CTAHeading = styled.h2`
	margin: 0 0 0.75rem 0;
	font-size: clamp(1.5rem, 3.2vw, 2rem);
	font-weight: 800;
`;

const CTAButton = styled.a`
	display: inline-block;
	background: #4338ca;
	color: white;
	text-decoration: none;
	padding: 0.9rem 1.1rem;
	border-radius: 12px;
	font-weight: 600;
	:focus-visible { outline: 2px solid #a5b4fc; outline-offset: 2px; }
	:hover { background: #3730a3; }
`;

export const Features: FC = () => {
	const features = [
		{ icon: '📋', title: 'Kanban Board', desc: 'Drag and drop applications between stages. Get a clear visual overview of your pipeline and the next steps.' },
		{ icon: '⏰', title: 'Reminders', desc: 'Set reminders for deadlines, interviews, and follow-ups. Stay on track without losing oversight.' },
		{ icon: '📄', title: 'Document Upload', desc: 'Upload and organize resumes, cover letters, and certificates. Attach documents directly to the right application.' },
		{ icon: '🔍', title: 'Search & Filters', desc: 'Quickly find applications by role, company, status, and more. Powerful filters give you full control.' },
		{ icon: '📊', title: 'Insights', desc: 'See progress and key metrics. Learn what works and focus your efforts where it matters most.' },
		{ icon: '🧭', title: 'Timeline', desc: 'Follow every activity in chronological order. See when you applied, followed up, and what’s coming next.' },
	];

	return (
		<Wrapper>
			<PublicNavbar />
			<Container>
				<Intro>
					<Title>Powerful features to streamline your job search</Title>
					<Lead>
						HirePath gives you the tools you need to stay on top of your job search.
						Here are a few features that help you from the first application to the job offer:
					</Lead>
				</Intro>
				<Grid>
					{features.map((f, i) => (
						<Card key={f.title} style={{ animationDelay: `${60 * i}ms` }}>
							<Icon aria-hidden="true">{f.icon}</Icon>
							<CardTitle>{f.title}</CardTitle>
							<CardDesc>{f.desc}</CardDesc>
						</Card>
					))}
				</Grid>
				<BottomCTA>
					<CTAHeading>Ready to get started?</CTAHeading>
					<CTAButton href="/" aria-label="Create your free account">Create Your Free Account</CTAButton>
				</BottomCTA>
			</Container>
			<Footer />
		</Wrapper>
	);
};

export default Features; 