import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

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
	@media (max-width: 640px) {
		display: none;
	}
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
	@media (max-width: 640px) {
		display: none;
	}
`;

const MenuButton = styled.button`
	justify-self: end;
	display: none;
	appearance: none;
	border: 1px solid #111827;
	background: #ffffff;
	color: #0b1220;
	padding: 0.45rem 0.6rem;
	border-radius: 10px;
	font-weight: 600;
	cursor: pointer;
	:focus-visible { outline: 2px solid #1f2937; outline-offset: 2px; }
	:hover { background: #f3f4f6; }
	@media (max-width: 640px) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}
`;

const MobileMenu = styled.div<{ $open: boolean }>`
	position: absolute;
	top: 100%;
	right: 1rem;
	background: #ffffff;
	color: #0b1220;
	border: 1px solid rgba(0,0,0,0.08);
	border-radius: 12px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	padding: 0.5rem;
	display: none;
	min-width: 220px;
	@media (max-width: 640px) {
		display: ${p => (p.$open ? 'grid' : 'none')};
		gap: 0.25rem;
	}
`;

const MobileItem = styled.a`
	text-decoration: none;
	color: #111827;
	padding: 0.6rem 0.75rem;
	border-radius: 8px;
	font-size: 0.95rem;
	:hover, :focus-visible { background: rgba(0,0,0,0.06); outline: none; }
`;

const ProfileButton = styled.a`
	justify-self: end;
	display: inline-block;
	padding: 0.5rem 0.9rem;
	border-radius: 10px;
	background: #4338ca;
	color: white;
	text-decoration: none;
	font-weight: 600;
	font-size: 0.95rem;
	transition: background-color 0.2s ease;
	:focus-visible {
		outline: 2px solid #a5b4fc;
		outline-offset: 2px;
	}
	:hover {
		background: #3730a3;
	}
	@media (max-width: 640px) {
		display: none;
	}
`;

export const Navbar: FC = () => {
	const [open, setOpen] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleSignOut = async (e: React.MouseEvent) => {
		e.preventDefault();
		// Navigation will be handled by AuthContext useEffect
	};

	return (
		<Header>
			<Nav aria-label="Primary">
				<BrandLink href="/" aria-label="HirePath home" onClick={() => setOpen(false)}>
					<BrandImg src="/logo-hirepath-wide.png" alt="HirePath" />
				</BrandLink>
				<NavList role="list">
					{user && (
						<li>
							<NavLink href="/dashboard">Dashboard</NavLink>
						</li>
					)}
					<li>
						<NavLink href="/features">Features</NavLink>
					</li>
					<li>
						<NavLink href="/about">About</NavLink>
					</li>
					<li>
						<NavLink href="/blog">Blog</NavLink>
					</li>
				</NavList>
				{user ? (
					<ProfileButton href="/profile">Profile</ProfileButton>
				) : (
					<LoginButton href="/signin" aria-label="Sign in">Sign in</LoginButton>
				)}
				<MenuButton aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(v => !v)}>
					<span>☰</span>
				</MenuButton>
				<MobileMenu id="mobile-menu" role="menu" $open={open}>
					{user && (
						<MobileItem href="/dashboard" onClick={() => setOpen(false)}>Dashboard</MobileItem>
					)}
					<MobileItem href="/features" onClick={() => setOpen(false)}>Features</MobileItem>
					<MobileItem href="/about" onClick={() => setOpen(false)}>About</MobileItem>
					<MobileItem href="/blog" onClick={() => setOpen(false)}>Blog</MobileItem>
					{user ? (
						<MobileItem href="/profile" onClick={() => setOpen(false)}>Profile</MobileItem>
					) : (
						<MobileItem href="/signin" onClick={() => setOpen(false)}>Sign in</MobileItem>
					)}
				</MobileMenu>
			</Nav>
		</Header>
	);
};

export default Navbar;