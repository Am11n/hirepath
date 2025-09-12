import type { FC } from 'react';
import styled from 'styled-components';

const Header = styled.header`
	position: sticky;
	top: 0;
	z-index: 10;
	width: 100%;
	background: #FAFAFA;
	color: #0b1220;
	box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;

const Nav = styled.nav`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0.9rem 1rem; /* slightly taller for visual balance */
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	gap: 1rem;
`;

const BrandLink = styled.a`
	display: inline-flex;
	align-items: center;
	gap: 0.6rem;
	text-decoration: none;
	color: inherit;
`;

const BrandImg = styled.img`
	display: block;
	height: 56px;
	width: auto;
`;

const NavList = styled.ul`
	display: flex;
	gap: 1rem;
	list-style: none;
	margin: 0;
	padding: 0;
	justify-self: center;
`;

const NavLink = styled.a`
	color: #111827;
	text-decoration: none;
	font-size: 0.95rem;
	padding: 0.5rem 0.6rem;
	border-radius: 8px;
	transition: background-color 0.2s ease, color 0.2s ease;
	:hover,
	:focus-visible {
		background-color: rgba(0, 0, 0, 0.06);
		outline: none;
		color: #0b1220;
	}
`;

const LoginButton = styled.a`
	justify-self: end;
	display: inline-block;
	padding: 0.5rem 0.9rem;
	border-radius: 10px;
	background: #ffffff;
	color: #0b1220;
	border: 1px solid #111827;
	text-decoration: none;
	font-weight: 600;
	font-size: 0.95rem;
	transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
	:focus-visible {
		outline: 2px solid #1f2937;
		outline-offset: 2px;
	}
	:hover {
		background: #f3f4f6;
		color: #0b1220;
		border-color: #0b1220;
	}
`;

export const Navbar: FC = () => {
	return (
		<Header>
			<Nav aria-label="Primary">
				<BrandLink href="/" aria-label="HirePath home">
					<BrandImg src="/logo-hirepath-wide.png" alt="HirePath" />
				</BrandLink>
				<NavList role="list">
					<li>
						<NavLink href="#features">Features</NavLink>
					</li>
					<li>
						<NavLink href="/about">About</NavLink>
					</li>
					<li>
						<NavLink href="#contact">Contact</NavLink>
					</li>
				</NavList>
				<LoginButton href="#login" aria-label="Logg inn">
					Logg inn
				</LoginButton>
			</Nav>
		</Header>
	);
};

export default Navbar; 