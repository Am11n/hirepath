import type { FC } from 'react';
import styled from 'styled-components';

const Header = styled.header`
	position: sticky;
	top: 0;
	z-index: 10;
	width: 100%;
	background: rgba(0, 0, 0, 0.4);
	backdrop-filter: saturate(120%) blur(6px);
	color: #fff;
`;

const Nav = styled.nav`
	max-width: 1200px;
	margin: 0 auto;
	padding: 0.75rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Brand = styled.a`
	font-size: 1.125rem;
	font-weight: 700;
	letter-spacing: 0.3px;
	color: #fff;
	text-decoration: none;
	:hover {
		text-decoration: underline;
	}
`;

const NavList = styled.ul`
	display: flex;
	gap: 1rem;
	list-style: none;
	margin: 0;
	padding: 0;
`;

const NavLink = styled.a`
	color: #eaeaea;
	text-decoration: none;
	font-size: 0.95rem;
	padding: 0.5rem 0.6rem;
	border-radius: 8px;
	transition: background-color 0.2s ease;
	:hover,
	:focus-visible {
		background-color: rgba(255, 255, 255, 0.12);
		outline: none;
		color: #fff;
	}
`;

export const Navbar: FC = () => {
	return (
		<Header>
			<Nav aria-label="Primary">
				<Brand href="#" aria-label="HirePath home">HirePath</Brand>
				<NavList role="list">
					<li>
						<NavLink href="#challenges">Challenges</NavLink>
					</li>
					<li>
						<NavLink href="#about">About</NavLink>
					</li>
					<li>
						<NavLink href="#contact">Contact</NavLink>
					</li>
				</NavList>
			</Nav>
		</Header>
	);
};

export default Navbar; 