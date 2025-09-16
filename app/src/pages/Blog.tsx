import type { FC } from 'react';
import { useState } from 'react';
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
	padding: 2rem 1rem 3rem 1rem;
`;

const HeroSection = styled.section`
	text-align: center;
	padding: 2rem 1rem 3rem 1rem;
`;

const HeroTitle = styled.h1`
	margin: 0 0 1rem 0;
	font-size: clamp(2rem, 4vw, 2.5rem);
	font-weight: 800;
`;

const HeroText = styled.p`
	margin: 0 auto 1.5rem auto;
	max-width: 70ch;
	color: #cbd5e1;
	font-size: 1.1rem;
	line-height: 1.6;
`;

const Section = styled.section`
	margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
	margin: 0 0 1.5rem 0;
	font-size: clamp(1.5rem, 3vw, 1.8rem);
	font-weight: 700;
`;

const ArticlesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 2rem;
`;

const ArticleCard = styled.div`
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	padding: 1.5rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}
`;

const ArticleImage = styled.div`
	height: 160px;
	background: rgba(67, 56, 202, 0.2);
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2.5rem;
	color: #818cf8;
`;

const ArticleTitle = styled.h3`
	margin: 0;
	font-size: 1.35rem;
	font-weight: 700;
	color: #ffffff;
	line-height: 1.3;
`;

const ArticleExcerpt = styled.p`
	margin: 0;
	color: #e5e7eb;
	font-size: 1rem;
	line-height: 1.6;
	flex-grow: 1;
`;

const ArticleMeta = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-top: 0.5rem;
`;

const AuthorAvatar = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #4338ca;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.75rem;
	font-weight: bold;
`;

const AuthorInfo = styled.div`
	font-size: 0.85rem;
	color: #94a3b8;
`;

const AuthorName = styled.span`
	color: #cbd5e1;
`;

const ReadMoreLink = styled.a`
	display: inline-block;
	background: #4338ca;
	color: white;
	text-decoration: none;
	padding: 0.6rem 1.2rem;
	border-radius: 8px;
	font-weight: 600;
	align-self: flex-start;
	transition: background-color 0.2s ease;
	:hover {
		background: #3730a3;
		transform: translateY(-2px);
	}
`;

const CategoriesSection = styled.section`
	margin-bottom: 3rem;
`;

const CategoriesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
`;

const CategoryCard = styled.div<{ $active?: boolean }>`
	background: ${p => p.$active ? 'rgba(67, 56, 202, 0.3)' : 'rgba(255, 255, 255, 0.06)'};
	border: 1px solid ${p => p.$active ? 'rgba(129, 140, 248, 0.5)' : 'rgba(255, 255, 255, 0.12)'};
	border-radius: 12px;
	padding: 1.25rem 1rem;
	text-align: center;
	cursor: pointer;
	transition: background 0.2s ease;
`;

const CategoryTitle = styled.h3`
	margin: 0 0 0.5rem 0;
	font-size: 1.1rem;
	font-weight: 600;
	color: #c7d2fe;
`;

const CategoryDesc = styled.p`
	margin: 0;
	color: #e0e7ff;
	font-size: 0.9rem;
`;

const CTASection = styled.section`
	background: rgba(67, 56, 202, 0.15);
	border: 1px solid rgba(129, 140, 248, 0.3);
	border-radius: 16px;
	padding: 2.5rem;
	text-align: center;
	margin: 3rem 0;
`;

const CTATitle = styled.h2`
	margin: 0 0 1rem 0;
	font-size: clamp(1.5rem, 3vw, 1.8rem);
	font-weight: 700;
`;

const CTAButton = styled.a`
	display: inline-block;
	background: #4338ca;
	color: white;
	text-decoration: none;
	padding: 0.9rem 1.5rem;
	border-radius: 12px;
	font-weight: 600;
	font-size: 1rem;
	transition: background-color 0.2s ease;
	:focus-visible {
		outline: 2px solid #a5b4fc;
		outline-offset: 2px;
	}
	:hover {
		background: #3730a3;
		transform: translateY(-2px);
	}
`;

export const Blog: FC = () => {
	const [activeCategory, setActiveCategory] = useState(0);
	
	const articles = [
		{
			title: 'How to Write a Standout Resume',
			excerpt: 'Your resume is your first impression. Learn how to highlight your achievements, tailor your CV for each role, and avoid the common mistakes that keep applicants from getting noticed.',
			icon: '📝',
			author: 'Sarah Johnson',
			date: 'May 15, 2023',
		},
		{
			title: 'Mastering the Job Interview',
			excerpt: 'From preparation to follow-up, we’ll guide you through the key steps to impress interviewers and show your best self. Includes tips for both in-person and online interviews.',
			icon: '🎤',
			author: 'Michael Chen',
			date: 'Apr 28, 2023',
		},
		{
			title: 'Stay Organized in Your Job Search',
			excerpt: 'Applying to multiple jobs can get messy. Here we share strategies (and how HirePath helps) to keep all your applications, tasks, and documents under control.',
			icon: '📅',
			author: 'Emma Rodriguez',
			date: 'Jun 2, 2023',
		},
		{
			title: 'Top 5 Mistakes to Avoid When Applying for Jobs',
			excerpt: 'Avoid pitfalls like generic cover letters, poor email etiquette, and missed deadlines. Small improvements can make a big difference.',
			icon: '⚠️',
			author: 'David Kim',
			date: 'Mar 19, 2023',
		},
	];

	const categories = [
		{
			title: 'Job Applications',
			description: 'Strategies for writing, sending, and tracking applications.',
		},
		{
			title: 'Resume & Cover Letter',
			description: 'CV writing, formatting, and tailoring tips.',
		},
		{
			title: 'Interview Skills',
			description: 'Prep guides, practice questions, and post-interview follow-ups.',
		},
		{
			title: 'Career Growth',
			description: 'Personal branding, networking, and professional development.',
		},
	];

	return (
		<Page>
			<PublicNavbar />
			<Container>
				<HeroSection>
					<HeroTitle>Blog</HeroTitle>
					<HeroText>Explore our best advice on resumes, applications, interviews, and career growth.</HeroText>
				</HeroSection>

				<CategoriesSection>
					<SectionTitle>Categories</SectionTitle>
					<CategoriesGrid>
						{categories.map((category, index) => (
							<CategoryCard 
								key={index} 
								$active={activeCategory === index}
								onClick={() => setActiveCategory(index)}
							>
								<CategoryTitle>{category.title}</CategoryTitle>
								<CategoryDesc>{category.description}</CategoryDesc>
							</CategoryCard>
						))}
					</CategoriesGrid>
				</CategoriesSection>

				<Section>
					<SectionTitle>Featured Articles</SectionTitle>
					<ArticlesGrid>
						{articles.map((article, index) => (
							<ArticleCard key={index}>
								<ArticleImage>{article.icon}</ArticleImage>
								<ArticleTitle>{article.title}</ArticleTitle>
								<ArticleExcerpt>{article.excerpt}</ArticleExcerpt>
								<ArticleMeta>
									<AuthorAvatar>{article.author.charAt(0)}</AuthorAvatar>
									<AuthorInfo>
										<AuthorName>{article.author}</AuthorName> • {article.date}
									</AuthorInfo>
								</ArticleMeta>
								<ReadMoreLink href="#">Read more</ReadMoreLink>
							</ArticleCard>
						))}
					</ArticlesGrid>
				</Section>

				<CTASection>
					<CTATitle>Ready to put these tips into action?</CTATitle>
					<CTAButton href="/signup">Create Your Free HirePath Account</CTAButton>
				</CTASection>
			</Container>
			<Footer />
		</Page>
	);
};

export default Blog;