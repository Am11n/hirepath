import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';

const Header = styled.header`
	position: sticky;
	top: 0;
	z-index: 10;
	width: 100%;
	background: ${props => props.theme.colors.cardSurface};
	color: ${props => props.theme.colors.headings};
	box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
`;

const Nav = styled.nav`
	padding: 0.9rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
`;

const LeftSection = styled.div`
	flex: 1;
`;

const CenterSection = styled.div`
	display: flex;
	justify-content: center;
	flex: 2;
`;

const RightSection = styled.div`
	display: flex;
	align-items: center;
	gap: 1.5rem;
	flex: 1;
	justify-content: flex-end;
`;

const SearchContainer = styled.div`
	min-width: 400px;
	max-width: 1000px;
	position: relative;
	width: 100%;
`;

const SearchInput = styled.input`
	width: 100%;
	background: rgba(255, 255, 255, 0.05);
	color: ${props => props.theme.colors.headings};
	border: 1px solid ${props => props.theme.colors.borders};
	border-radius: 8px;
	padding: 0.85rem 1.25rem 0.85rem 3rem;
	font-size: 1.1rem;
	
	&:focus {
		outline: 2px solid ${props => props.theme.colors.primary};
		outline-offset: 2px;
		border-color: ${props => props.theme.colors.primary};
	}
`;

const SearchIcon = styled.span`
	position: absolute;
	left: 1.25rem;
	top: 50%;
	transform: translateY(-50%);
	color: ${props => props.theme.colors.bodyText};
	font-size: 1.2rem;
`;

const IconContainer = styled.div`
	position: relative;
`;

const IconButton = styled.button`
	background: none;
	border: none;
	color: ${props => props.theme.colors.bodyText};
	padding: 0.5rem;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	
	&:hover,
	&:focus-visible {
		background-color: rgba(255, 255, 255, 0.06);
		outline: none;
		color: ${props => props.theme.colors.headings};
	}
`;

const NotificationBadge = styled.span`
	position: absolute;
	top: -5px;
	right: -5px;
	background: ${props => props.theme.colors.error};
	color: white;
	border-radius: 50%;
	font-size: 0.7rem;
	width: 18px;
	height: 18px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const UserAvatar = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: 600;
	font-size: 0.9rem;
	cursor: pointer;
`;

const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	background: ${props => props.theme.colors.cardSurface};
	color: ${props => props.theme.colors.headings};
	border: 1px solid ${props => props.theme.colors.borders};
	border-radius: 12px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	padding: 0.5rem;
	min-width: 200px;
	margin-top: 0.5rem;
	z-index: 100;
`;

const DropdownItem = styled.a`
	display: block;
	text-decoration: none;
	color: ${props => props.theme.colors.bodyText};
	padding: 0.75rem;
	border-radius: 8px;
	font-size: 0.95rem;
	
	&:hover,
	&:focus-visible {
		background-color: rgba(255, 255, 255, 0.06);
		outline: none;
		color: ${props => props.theme.colors.headings};
	}
`;

const Divider = styled.div`
	height: 1px;
	background: ${props => props.theme.colors.borders};
	margin: 0.5rem 0;
`;

const LoginButton = styled.a`
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

const MenuButton = styled.button`
	display: none;
	appearance: none;
	border: 1px solid ${props => props.theme.colors.borders};
	background: rgba(255, 255, 255, 0.05);
	color: ${props => props.theme.colors.headings};
	padding: 0.45rem 0.6rem;
	border-radius: 10px;
	font-weight: 600;
	cursor: pointer;
	:focus-visible { outline: 2px solid #1f2937; outline-offset: 2px; }
	:hover { background: rgba(255, 255, 255, 0.1); }
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
	background: ${props => props.theme.colors.cardSurface};
	color: ${props => props.theme.colors.headings};
	border: 1px solid ${props => props.theme.colors.borders};
	border-radius: 12px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	padding: 0.5rem;
	display: none;
	min-width: 220px;
	z-index: 100;
	@media (max-width: 640px) {
		display: ${p => (p.$open ? 'grid' : 'none')};
		gap: 0.25rem;
	}
`;

const MobileItem = styled.a`
	text-decoration: none;
	color: ${props => props.theme.colors.bodyText};
	padding: 0.6rem 0.75rem;
	border-radius: 8px;
	font-size: 0.95rem;
	:hover, :focus-visible { 
		background: rgba(255, 255, 255, 0.06); 
		outline: none; 
		color: ${props => props.theme.colors.headings};
	}
`;

const NotificationBellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface NavbarProps {
  onMenuToggle?: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onMenuToggle }) => {
	const [open, setOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const userDropdownRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const { user, signOut } = useAuth();
	const navigate = useNavigate();

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
				setUserDropdownOpen(false);
			}
			if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
				setNotificationsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSignOut = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await signOut();
			navigate('/'); // Redirect to home page after sign out
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	const handleMenuToggle = () => {
		if (onMenuToggle) {
			onMenuToggle();
		}
		setOpen(v => !v);
	};

	const handleSearchShortcut = (e: React.KeyboardEvent) => {
		if (e.key === '/' && e.ctrlKey) {
			e.preventDefault();
			const searchInput = document.getElementById('search-input');
			if (searchInput) {
				searchInput.focus();
			}
		}
	};

	return (
		<Header>
			<Nav aria-label="Primary" onKeyDown={handleSearchShortcut}>
				<LeftSection></LeftSection> {/* Empty div to balance the left side */}
				
				<CenterSection>
					<SearchContainer>
						<SearchIcon>🔍</SearchIcon>
						<SearchInput 
							id="search-input"
							type="text" 
							placeholder="Search… (Ctrl + /)" 
						/>
					</SearchContainer>
				</CenterSection>
				
				<RightSection>
					<IconContainer ref={notificationsRef}>
						<IconButton 
							aria-label="Notifications" 
							onClick={() => setNotificationsOpen(!notificationsOpen)}
						>
							<NotificationBellIcon />
							<NotificationBadge>3</NotificationBadge>
						</IconButton>
						{notificationsOpen && (
							<Dropdown>
								<DropdownItem href="#">New application received</DropdownItem>
								<DropdownItem href="#">Interview scheduled</DropdownItem>
								<DropdownItem href="#">Document uploaded</DropdownItem>
							</Dropdown>
						)}
					</IconContainer>
					
					{user ? (
						<IconContainer ref={userDropdownRef}>
							<UserAvatar onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
								{user.email?.charAt(0).toUpperCase() || 'U'}
							</UserAvatar>
							{userDropdownOpen && (
								<Dropdown>
									<DropdownItem href="/profile">Profile</DropdownItem>
									<DropdownItem href="/settings">Settings</DropdownItem>
									<Divider />
									<DropdownItem href="#" onClick={handleSignOut}>Sign out</DropdownItem>
								</Dropdown>
							)}
						</IconContainer>
					) : (
						<LoginButton href="/signin" aria-label="Sign in">Sign in</LoginButton>
					)}
					
					<MenuButton onClick={handleMenuToggle}>
						☰
					</MenuButton>
				</RightSection>
				
				<MobileMenu $open={open}>
					<MobileItem href="/features">Features</MobileItem>
					<MobileItem href="/blog">Blog</MobileItem>
					<MobileItem href="/about">About</MobileItem>
					{user ? (
						<>
							<MobileItem href="/dashboard">Dashboard</MobileItem>
							<MobileItem href="/profile">Profile</MobileItem>
							<MobileItem href="#" onClick={handleSignOut}>Sign out</MobileItem>
						</>
					) : (
						<MobileItem href="/signin">Sign in</MobileItem>
					)}
				</MobileMenu>
			</Nav>
		</Header>
	);
};

export default Navbar;