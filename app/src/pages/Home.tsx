import type { FC } from 'react';
import styled from 'styled-components';
import { PublicNavbar } from '../components/PublicNavbar';
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

const Intro = styled.section`
	padding: 2rem 0 1rem 0;
	display: grid;
	gap: 0.5rem;
`;

const IntroTitle = styled.h2`
	margin: 0;
	font-size: clamp(1.5rem, 3.2vw, 2rem);
	font-weight: 800;
`;

const IntroText = styled.p`
	margin: 0;
	max-width: 70ch;
	color: #cbd5e1;
	font-size: 1.05rem;
	line-height: 1.6;
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

const ShowcaseImage = styled.img`
	display: block;
	width: 100%;
	height: auto;
	border-radius: 16px;
`;

const ShowcaseBleed = styled.div`
	width: min(1600px, 100vw);
	margin-left: 50%;
	transform: translateX(-50%);
	padding: 0 1rem;
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
		{ icon: '📋', title: 'Kanban Board', desc: 'Drag and drop applications between stages.' },
		{ icon: '⏰', title: 'Reminders', desc: 'Get alerts before interviews and deadlines.' },
		{ icon: '📄', title: 'Document Upload', desc: 'Store your resume and cover letters.' },
		{ icon: '🔍', title: 'Search & Filters', desc: 'Find applications quickly.' },
		{ icon: '📊', title: 'Insights', desc: 'See stats and progress.' },
	];

	// Removed showcase images and grid

	return (
		<Page>
			<PublicNavbar />
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
							<PrimaryButton href="/features" aria-label="Get Started">
								Get Started
							</PrimaryButton>
						</CTA>
					</HeroInner>
				</HeroContent>
			</Hero>
			<Container>
				<Intro aria-labelledby="intro-title">
					<IntroTitle id="intro-title">Your clear path from application to job.</IntroTitle>
					<IntroText>
						Tired of messy spreadsheets and scattered documents? HirePath helps you track applications, organize tasks, and manage CVs and cover letters — all in one simple dashboard. From the first application to your next job offer, HirePath gives you structure, clarity, and confidence every step of the way.
					</IntroText>
				</Intro>
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
					<ShowcaseBleed>
						<ShowcaseImage src={encodeURI('/Showcase-bilde.svg')} alt="HirePath showcase" />
					</ShowcaseBleed>
				</ShowcaseSection>
			</Container>

			<BottomCTA aria-labelledby="cta-bottom-title">
				<BottomCTAInner>
					<BottomHeading id="cta-bottom-title">Ready to organize your job search?</BottomHeading>
					<BottomButton href="/signup" aria-label="Create Your Free Account">Create Your Free Account</BottomButton>
				</BottomCTAInner>
			</BottomCTA>

			<Footer />
		</Page>
	);
};

export default Home; 