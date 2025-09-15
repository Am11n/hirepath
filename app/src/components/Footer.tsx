import type { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.footer`
	background: #0b1220;
	color: #e5e7eb;
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	flex-wrap: wrap;
`;

const Links = styled.nav`
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
`;

const Link = styled.a`
	color: #cbd5e1;
	text-decoration: none;
	font-size: 0.95rem;
	:focus-visible {
		outline: 2px solid #94a3b8;
		outline-offset: 2px;
	}
	:hover { color: #ffffff; }
`;

const Tagline = styled.p`
	margin: 0.25rem 0 0 0;
	font-size: 0.95rem;
	color: #94a3b8;
`;

const Socials = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: center;
`;

const SocialLink = styled.a`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: #111827;
	display: grid;
	place-items: center;
	color: #e5e7eb;
	text-decoration: none;
	font-size: 0.9rem;
	:focus-visible { outline: 2px solid #94a3b8; outline-offset: 2px; }
	:hover { background: #1f2937; }
`;

const Copyright = styled.p`
	margin: 0.25rem 0 0 0;
	font-size: 0.85rem;
	color: #64748b;
`;

export const Footer: FC = () => {
	return (
		<Wrapper>
			<Inner>
				<Row>
					<Links aria-label="Footer links">
						<Link href="/about">About</Link>
						<Link href="#contact">Contact</Link>
						<Link href="#privacy">Privacy Policy</Link>
					</Links>
					<Socials aria-label="Social links">
						<SocialLink href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</SocialLink>
						<SocialLink href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</SocialLink>
					</Socials>
				</Row>
				<Tagline>HirePath – Your clear path from application to job.</Tagline>
				<Copyright>© {new Date().getFullYear()} HirePath. All rights reserved.</Copyright>
			</Inner>
		</Wrapper>
	);
};

export default Footer; 