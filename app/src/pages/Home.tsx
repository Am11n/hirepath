import type { FC } from 'react';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { ChallengeCard } from '../components/ChallengeCard';

const Page = styled.main`
	min-height: 100vh;
	background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
	color: #ffffff;
`;

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 1rem 3rem 1rem;
`;

const Hero = styled.section`
	position: relative;
	min-height: 100vh;
	display: grid;
	place-items: center;
	text-align: left;
	overflow: clip;
`;

const HeroInner = styled.div`
	width: 100%;
	max-width: 1200px;
	padding: 5rem 1rem 3rem 1rem;
	margin: 0 auto;
	display: grid;
	gap: 1rem;
`;

const HeroMedia = styled.div`
	position: absolute;
	inset: 0;
	z-index: 0;
	overflow: hidden;
`;

const Video = styled.video`
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: center;
	pointer-events: none;
`;

const HeroOverlay = styled.div`
	position: absolute;
	inset: 0;
	background: linear-gradient(180deg, rgba(11, 18, 32, 0.65) 0%, rgba(15, 23, 42, 0.85) 100%);
`;

const HeroContent = styled.div`
	position: relative;
	z-index: 1;
`;

const Heading = styled.h1`
	margin: 0;
	font-size: clamp(2.25rem, 6vw, 3.5rem);
	line-height: 1.05;
	font-weight: 800;
	letter-spacing: -0.02em;
`;

const Subheading = styled.p`
	margin: 0;
	max-width: 64ch;
	color: #e5e7eb;
	font-size: clamp(1.05rem, 2.5vw, 1.25rem);
`;

const CTA = styled.div`
	margin-top: 1.25rem;
`;

const PrimaryButton = styled.a`
	display: inline-block;
	background: #4338ca;
	color: white;
	text-decoration: none;
	padding: 0.85rem 1.1rem;
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
			<Hero aria-labelledby="hero-title" aria-describedby="hero-desc">
				<HeroMedia aria-hidden="true">
					<Video autoPlay muted loop playsInline preload="metadata" poster="/hero.jpg">
						<source src="/videos/hero.mp4" type="video/mp4" />
					</Video>
					<HeroOverlay aria-hidden="true" />
				</HeroMedia>
				<HeroContent>
					<HeroInner>
						<Heading id="hero-title">Sharpen your skills with hands-on challenges</Heading>
						<Subheading id="hero-desc">Practice real-world tasks, build a job-ready portfolio, and join thousands building in public.</Subheading>
						<CTA>
							<PrimaryButton href="#challenges" aria-label="View all challenges">
								View All Challenges
							</PrimaryButton>
						</CTA>
					</HeroInner>
				</HeroContent>
			</Hero>
			<Container>
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