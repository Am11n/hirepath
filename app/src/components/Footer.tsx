import type { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.footer`
	background: linear-gradient(180deg, #a9ccd9 0%, #dbe2e8 60%, #c7d0d8 100%);
	color: #0b1220;
	padding: 2rem 1rem;
	margin-top: auto;
`;

const Inner = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	display: grid;
	gap: 1rem;
`;

const Row = styled.div`
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	gap: 1rem;
	flex-wrap: wrap;
	
	@media (max-width: 640px) {
		grid-template-columns: 1fr;
		text-align: center;
	}
`;

const Links = styled.nav`
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	justify-content: flex-start;
	
	@media (max-width: 640px) {
		justify-content: center;
	}
`;

const Link = styled.a`
	color: #0b1a2a;
	text-decoration: none;
	font-size: 0.95rem;
	:focus-visible {
		outline: 2px solid #64748b;
		outline-offset: 2px;
	}
	:hover { color: #111827; }
`;

const Tagline = styled.p`
	margin: 0;
	font-size: 0.95rem;
	color: #1f2937;
	text-align: center;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	flex-wrap: nowrap;
	white-space: nowrap;
	line-height: 1.1;
	width: 100%;

	@media (max-width: 360px) {
		font-size: 0.875rem;
	}
`;

const TaglineLogo = styled.img`
	height: 1em; /* same visual height as text */
	width: auto;
	vertical-align: middle;
	flex: 0 0 auto;
`;

const Socials = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: center;
	justify-content: flex-end;
	
	@media (max-width: 640px) {
		justify-content: center;
	}
`;

const SocialLink = styled.a`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: rgba(17, 24, 39, 0.1);
	display: grid;
	place-items: center;
	color: #111827;
	text-decoration: none;
	font-size: 0.9rem;
	:focus-visible { outline: 2px solid #64748b; outline-offset: 2px; }
	:hover { background: rgba(17, 24, 39, 0.18); }
`;

const Copyright = styled.p`
	margin: 0.25rem 0 0 0;
	font-size: 0.85rem;
	color: #374151;
	text-align: center;
`;

export const Footer: FC = () => {
	return (
		<Wrapper>
			<Inner>
				<Row>
					<Links aria-label="Footer links">
						<Link href="/about">About</Link>
						<Link href="/blog">Blog</Link>
						<Link href="/privacy">Privacy Policy</Link>
					</Links>
					<Tagline>
						<TaglineLogo src={encodeURI('/images/Logo uten navn-HirePath.svg')} alt="HirePath" />
						HirePath – Your clear path from application to job.
					</Tagline>
					<Socials aria-label="Social links">
						<SocialLink href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</SocialLink>
						<SocialLink href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</SocialLink>
					</Socials>
				</Row>
				<Copyright>© {new Date().getFullYear()} HirePath. All rights reserved.</Copyright>
			</Inner>
		</Wrapper>
	);
};

export default Footer;