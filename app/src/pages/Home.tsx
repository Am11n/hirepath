import type { FC } from 'react';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Page = styled.main`
	min-height: 100vh;
	background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
	color: #ffffff;
	display: flex;
	flex-direction: column;
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

const FeaturesSection = styled.section`
	padding: 3rem 0 1rem 0;
`;

const FeaturesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	gap: 1rem;
	@media (max-width: 1100px) {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		grid-template-columns: 1fr;
	}
`;

const FeatureCard = styled.div`
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	padding: 1rem;
	display: grid;
	gap: 0.5rem;
	min-height: 140px;
`;

const FeatureIcon = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 12px;
	background: rgba(67, 56, 202, 0.2);
	color: #c7d2fe;
	display: grid;
	place-items: center;
	font-size: 20px;
`;

const FeatureTitle = styled.h3`
	margin: 0;
	font-size: 1.05rem;
	font-weight: 700;
	color: #ffffff;
`;

const FeatureDesc = styled.p`
	margin: 0;
	color: #e5e7eb;
	font-size: 0.975rem;
`;

const ShowcaseSection = styled.section`
	padding: 3rem 0 4rem 0;
`;

const ShowcaseTitle = styled.h2`
	margin: 0 0 1rem 0;
	font-size: clamp(1.5rem, 3.2vw, 2rem);
	font-weight: 800;
`;

const LaptopFrame = styled.div`
	margin: 0 auto;
	max-width: 980px;
	border-radius: 16px 16px 10px 10px;
	background: #0e1424;
	border: 1px solid rgba(255, 255, 255, 0.12);
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
	position: relative;
	:before {
		content: '';
		display: block;
		height: 26px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 16px 16px 0 0;
		background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
	}
`;

const Screen = styled.div`
	background: #0b1220;
	aspect-ratio: 16 / 9;
	border-radius: 0 0 10px 10px;
	overflow: hidden;
	img { display: block; width: 100%; height: 100%; object-fit: cover; }
`;

const Placeholder = styled.div`
	display: grid;
	place-items: center;
	height: 100%;
	color: #cbd5e1;
	font-size: 0.95rem;
`;

const BottomCTA = styled.section`
	padding: 3rem 1rem 3rem 1rem;
	background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
`;

const BottomCTAInner = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	display: grid;
	gap: 1rem;
	text-align: center;
`;

const BottomHeading = styled.h2`
	margin: 0;
	font-size: clamp(1.5rem, 3.2vw, 2rem);
	font-weight: 800;
`;

const BottomButton = styled.a`
	justify-self: center;
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

export const Home: FC = () => {
	const features = [
		{ icon: '📋', title: 'Kanban Board', desc: 'Dra og slipp søknader mellom statuser.' },
		{ icon: '⏰', title: 'Reminders', desc: 'Få varsler før intervjuer og deadlines.' },
		{ icon: '📄', title: 'Document Upload', desc: 'Lagre CV og søknadsbrev.' },
		{ icon: '🔍', title: 'Search & Filters', desc: 'Finn søknader raskt.' },
		{ icon: '📊', title: 'Insights', desc: 'Se statistikk og progresjon.' },
	];

	const showcaseSrc = '/showcase/app-home.png';

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
						<Heading id="hero-title">Stay on top of your job applications with ease.</Heading>
						<Subheading id="hero-desc">Organize applications, track activities, upload documents, and never miss a deadline.</Subheading>
						<CTA>
							<PrimaryButton href="#features" aria-label="Get Started">
								Get Started
							</PrimaryButton>
						</CTA>
					</HeroInner>
				</HeroContent>
			</Hero>
			<Container>
				<FeaturesSection id="features" aria-label="Key features">
					<FeaturesGrid>
						{features.map((f) => (
							<FeatureCard key={f.title}>
								<FeatureIcon aria-hidden="true">{f.icon}</FeatureIcon>
								<FeatureTitle>{f.title}</FeatureTitle>
								<FeatureDesc>{f.desc}</FeatureDesc>
							</FeatureCard>
						))}
					</FeaturesGrid>
				</FeaturesSection>

				<ShowcaseSection aria-label="Showcase">
					<ShowcaseTitle>Showcase</ShowcaseTitle>
					<LaptopFrame>
						<Screen>
							<img src={showcaseSrc} alt="App screenshot" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
							<Placeholder>Legg til et skjermbilde i /public/showcase/app-home.png</Placeholder>
						</Screen>
					</LaptopFrame>
				</ShowcaseSection>
			</Container>

			<BottomCTA aria-labelledby="cta-bottom-title">
				<BottomCTAInner>
					<BottomHeading id="cta-bottom-title">Ready to organize your job search?</BottomHeading>
					<BottomButton href="#" aria-label="Create Your Free Account">Create Your Free Account</BottomButton>
				</BottomCTAInner>
			</BottomCTA>

			<Footer />
		</Page>
	);
};

export default Home; 