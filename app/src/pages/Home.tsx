import type { FC } from 'react';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { ChallengeCard } from '../components/ChallengeCard';

const Page = styled.main`
	min-height: 100vh;
	background: url('/hero.jpg') center/cover no-repeat fixed, linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
	color: #ffffff;
`;

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem 3rem 1rem;
`;

const Hero = styled.section`
	padding: 5rem 0 3rem 0;
	display: grid;
	gap: 1rem;
	text-align: left;
	@media (max-width: 640px) {
		padding-top: 4rem;
	}
`;

const Heading = styled.h1`
	margin: 0;
	font-size: clamp(2rem, 5vw, 3rem);
	line-height: 1.1;
	font-weight: 800;
	letter-spacing: -0.02em;
`;

const Subheading = styled.p`
	margin: 0;
	max-width: 56ch;
	color: #e5e7eb;
	font-size: clamp(1rem, 2.5vw, 1.125rem);
`;

const CTA = styled.div`
	margin-top: 1rem;
`;

const PrimaryButton = styled.a`
	display: inline-block;
	background: #4338ca;
	color: white;
	text-decoration: none;
	padding: 0.75rem 1rem;
	border-radius: 12px;
	font-weight: 600;
	transition: background-color 0.2s ease;
	:focus-visible {
		outline: 2px solid #a5b4fc;
		outline-offset: 2px;
	}
	:hover {
		background: #3730a3;
	}
`;

const Grid = styled.section`
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
	margin-top: 2rem;
	@media (max-width: 900px) {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

export const Home: FC = () => {
	return (
		<Page>
			<Navbar />
			<Container>
				<Hero aria-labelledby="hero-title" aria-describedby="hero-desc">
					<Heading id="hero-title">Sharpen your skills with hands-on challenges</Heading>
					<Subheading id="hero-desc">Practice real-world tasks, build a job-ready portfolio, and join thousands building in public.</Subheading>
					<CTA>
						<PrimaryButton href="#challenges" aria-label="View all challenges">
							View All Challenges
						</PrimaryButton>
					</CTA>
				</Hero>
				<Grid id="challenges" aria-label="Popular challenges">
					<ChallengeCard title="Frontend Landing Page" participants={1324} imageUrl="/images/landing.jpg" />
					<ChallengeCard title="REST API with Express" participants={982} imageUrl="/images/api.jpg" />
					<ChallengeCard title="Fullstack Task Manager" participants={756} imageUrl="/images/fullstack.jpg" />
				</Grid>
			</Container>
		</Page>
	);
};

export default Home; 