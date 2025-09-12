import type { FC } from 'react';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Wrapper = styled.main`
	min-height: 100vh;
	background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
	color: #ffffff;
	display: flex;
	flex-direction: column;
`;

const Container = styled.div`
	max-width: 1000px;
	margin: 0 auto;
	padding: 5rem 1rem 3rem 1rem;
	display: grid;
	gap: 1.25rem;
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

const Section = styled.section`
	display: grid;
	gap: 0.75rem;
`;

const SectionTitle = styled.h2`
	margin: 1.5rem 0 0.25rem 0;
	font-size: 1.25rem;
	font-weight: 700;
`;

const Paragraph = styled.p`
	margin: 0;
	color: #e5e7eb;
`;

const List = styled.ul`
	margin: 0;
	padding-left: 1rem;
	color: #e5e7eb;
	li { margin: 0.5rem 0; }
`;

export const About: FC = () => {
	return (
		<Wrapper>
			<Navbar />
			<Container>
				<Title>About HirePath</Title>
				<Lead>Your clear path from application to job</Lead>

				<Section>
					<Paragraph>
						Finding a job can feel overwhelming — endless applications, scattered documents, and no real overview of your progress. HirePath is here to change that.
					</Paragraph>
					<Paragraph>
						With HirePath, you get a modern job and application tracker that helps you stay organized, focused, and motivated throughout your career journey. Our mission is simple: to give you clarity from the very first application all the way to your dream job.
					</Paragraph>
				</Section>

				<Section>
					<SectionTitle>What you can do with HirePath</SectionTitle>
					<List>
						<li>
							<strong>Track every application</strong> — Keep all your job applications in one place, with clear statuses and timelines. No more messy spreadsheets or lost emails.
						</li>
						<li>
							<strong>Stay on top of tasks</strong> — Each application comes with its own checklist and task list so you never miss a deadline, follow-up, or interview prep.
						</li>
						<li>
							<strong>Organize documents</strong> — Upload and manage your CVs, cover letters, and certificates directly in the app, connected to the right job opportunity.
						</li>
						<li>
							<strong>Follow your progress</strong> — Get an overview of all your applications, see what’s pending, what’s in progress, and where you’re moving forward.
						</li>
						<li>
							<strong>Personalize your journey</strong> — Customize your profile, manage notifications, and adapt HirePath to fit the way you like to work.
						</li>
					</List>
				</Section>

				<Section>
					<SectionTitle>Why HirePath?</SectionTitle>
					<Paragraph>
						Because applying for jobs shouldn’t feel like a second full-time job. HirePath gives you structure without stress, clarity without clutter, and a tool that grows with you. Whether you’re applying for your very first role, making a career switch, or actively hunting for your next big step — HirePath keeps you in control.
					</Paragraph>
				</Section>

				<Section>
					<SectionTitle>Our vision</SectionTitle>
					<Paragraph>
						At HirePath, we believe in empowering people to reach their career goals with confidence. By making the application process easier to manage, we help you focus on what truly matters: showing your best self to future employers.
					</Paragraph>
				</Section>
			</Container>
			<Footer />
		</Wrapper>
	);
};

export default About; 