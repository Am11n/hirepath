import { useState, useRef, useEffect } from 'react';
import { useCallback } from 'react';
import type { FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { useThemeMode } from '../contexts/themeMode';
import { useI18n } from '../contexts/I18nProvider';
import { supabase } from '../lib/supabaseClient';

const Header = styled.header`
	position: sticky;
	top: 0;
	z-index: 10;
	width: 100%;
	background: ${props => props.theme.glass.navbar};
	backdrop-filter: saturate(120%) blur(6px);
	color: ${props => props.theme.colors.headings};
	box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
	
	@media (max-width: 640px) {
		position: relative;
	}
`;

const Nav = styled.nav`
	padding: 0.9rem 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1.5rem;
	
	@media (max-width: 640px) {
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: space-between;
	}
`;

const LeftSection = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	gap: 1rem;
	
	@media (max-width: 640px) {
		order: 1;
		flex: 0 0 auto;
	}
`;

const CenterSection = styled.div`
	display: flex;
	justify-content: center;
	flex: 2;
	
	@media (max-width: 640px) {
		order: 2;
		flex: 1;
		margin: 0.75rem 0;
		justify-content: flex-start;
	}
`;

const RightSection = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex: 1;
	justify-content: flex-end;
	
	@media (max-width: 640px) {
		order: 3;
		flex: 0 0 auto;
		gap: 0.75rem; /* spacing between icon group and user */
		margin-left: auto; /* push icons to the far right */
	}
`;

const IconGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 0.25rem; /* tighter spacing between theme and notifications */
`;

const SearchContainer = styled.div`
	min-width: 400px;
	max-width: 1000px;
	position: relative;
	width: 100%;
	
	@media (max-width: 768px) {
		min-width: 300px;
		max-width: 600px;
	}
	
	@media (max-width: 640px) {
		min-width: 140px;
		max-width: 140px; /* give more room for the icon cluster */
	}
	
	@media (max-width: 480px) {
		min-width: 130px;
		max-width: 130px;
	}
	
	@media (max-width: 320px) {
		min-width: 110px;
		max-width: 110px;
	}
`;

const SearchInput = styled.input`
	width: 100%;
	background: rgba(255, 255, 255, 0.05);
	color: ${props => props.theme.colors.headings};
	border: 1px solid ${props => props.theme.colors.borders};
	border-radius: 8px;
	padding: 0.85rem 1.25rem 0.85rem 3rem;
	font-size: 1.1rem;
	
	@media (max-width: 768px) {
		padding: 0.7rem 1rem 0.7rem 2.5rem;
		font-size: 1rem;
	}
	
	@media (max-width: 480px) {
		padding: 0.6rem 0.8rem 0.6rem 2rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.5rem 0.6rem 0.5rem 1.5rem;
		font-size: 0.8rem;
	}
	
	&:focus {
		outline: 2px solid ${props => props.theme.colors.primary};
		outline-offset: 2px;
		border-color: ${props => props.theme.colors.primary};
	}
`;

// Add styled component for search suggestions dropdown
const SearchSuggestions = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: ${props => props.theme.glass.dropdown};
	backdrop-filter: saturate(120%) blur(8px);
	border: 1px solid ${props => props.theme.colors.borders};
	border-radius: 8px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	margin-top: 0.5rem;
	z-index: 100;
	max-height: 300px;
	overflow-y: auto;
	
	@media (max-width: 480px) {
		margin-top: 0.4rem;
	}
	
	@media (max-width: 320px) {
		margin-top: 0.3rem;
	}
`;

const SearchSuggestionItem = styled.div`
	padding: 0.75rem 1rem;
	color: ${props => props.theme.colors.headings};
	cursor: pointer;
	
	&:hover {
		background-color: rgba(59, 130, 246, 0.1);
	}
	
	@media (max-width: 480px) {
		padding: 0.6rem 0.8rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.5rem 0.7rem;
		font-size: 0.85rem;
	}
`;

const SearchCategory = styled.div`
	padding: 0.5rem 1rem;
	font-size: 0.8rem;
	color: ${props => props.theme.colors.bodyText};
	font-weight: 600;
	text-transform: uppercase;
	
	@media (max-width: 480px) {
		padding: 0.4rem 0.8rem;
		font-size: 0.75rem;
	}
`;

const SearchIcon = styled.span`
	position: absolute;
	left: 1.25rem;
	top: 50%;
	transform: translateY(-50%);
	color: ${props => props.theme.colors.bodyText};
	font-size: 1.2rem;
	
	@media (max-width: 768px) {
		left: 1rem;
		font-size: 1.1rem;
	}
	
	@media (max-width: 480px) {
		left: 0.8rem;
		font-size: 1rem;
	}
	
	@media (max-width: 320px) {
		left: 0.6rem;
		font-size: 0.9rem;
	}
`;

const IconContainer = styled.div`
	position: relative;
`;

const IconButton = styled.button`
	background: none;
	border: none;
	color: ${props => props.theme.colors.primary};
	padding: 0.5rem;
	border-radius: 8px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	
	@media (max-width: 768px) {
		padding: 0.4rem;
	}
	
	@media (max-width: 480px) {
		padding: 0.3rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.25rem;
	}
	
	&:hover,
	&:focus-visible {
		background-color: rgba(59, 130, 246, 0.1);
		outline: none;
		color: ${props => props.theme.colors.primary};
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
	
	@media (max-width: 480px) {
		font-size: 0.6rem;
		width: 16px;
		height: 16px;
		top: -3px;
		right: -3px;
	}
	
	@media (max-width: 320px) {
		font-size: 0.5rem;
		width: 14px;
		height: 14px;
		top: -2px;
		right: -2px;
	}
`;

const UserAvatar = styled.div<{ $hasImage?: boolean }>`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: ${props => props.$hasImage ? 'transparent' : `linear-gradient(90deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`};
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-weight: 600;
	font-size: 0.9rem;
	cursor: pointer;
	overflow: hidden;
	
	@media (max-width: 768px) {
		width: 30px;
		height: 30px;
		font-size: 0.85rem;
	}
	
	@media (max-width: 480px) {
		width: 28px;
		height: 28px;
		font-size: 0.8rem;
	}
	
	@media (max-width: 320px) {
		width: 26px;
		height: 26px;
		font-size: 0.75rem;
	}
`;

const Dropdown = styled.div`
	position: absolute;
	top: 100%;
	right: 0;
	background: ${props => props.theme.glass.dropdown};
	backdrop-filter: saturate(120%) blur(8px);
	color: ${props => props.theme.colors.headings};
	border: 1px solid ${props => props.theme.colors.borders};
	border-radius: 12px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	padding: 0.5rem;
	min-width: 200px;
	margin-top: 0.5rem;
	z-index: 100;
	
	@media (max-width: 480px) {
		min-width: 180px;
		padding: 0.4rem;
		margin-top: 0.4rem;
	}
	
	@media (max-width: 320px) {
		min-width: 160px;
		padding: 0.3rem;
		margin-top: 0.3rem;
		font-size: 0.9rem;
	}
`;

const DropdownItem = styled.a`
	display: block;
	text-decoration: none;
	color: ${props => props.theme.colors.bodyText};
	padding: 0.75rem;
	border-radius: 8px;
	font-size: 0.95rem;
	
	@media (max-width: 480px) {
		padding: 0.6rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.5rem;
		font-size: 0.85rem;
	}
	
	&:hover,
	&:focus-visible {
		background-color: rgba(255, 255, 255, 0.06);
		outline: none;
		color: ${props => props.theme.colors.headings};
	}
`;

const DropdownLink = styled(Link)`
	display: block;
	text-decoration: none;
	color: ${props => props.theme.colors.bodyText};
	padding: 0.75rem;
	border-radius: 8px;
	font-size: 0.95rem;
	
	@media (max-width: 480px) {
		padding: 0.6rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.5rem;
		font-size: 0.85rem;
	}
	
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
	
	@media (max-width: 320px) {
		margin: 0.4rem 0;
	}
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
	
	@media (max-width: 768px) {
		padding: 0.45rem 0.8rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 480px) {
		padding: 0.4rem 0.7rem;
		font-size: 0.85rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.35rem 0.6rem;
		font-size: 0.8rem;
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
	
	:focus-visible { 
		outline: 2px solid #1f2937; 
		outline-offset: 2px; 
	}
	
	:hover { 
		background: rgba(255, 255, 255, 0.1); 
	}
	
	@media (max-width: 768px) {
		padding: 0.4rem 0.55rem;
		font-size: 0.95rem;
	}
	
	@media (max-width: 480px) {
		padding: 0.35rem 0.5rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.3rem 0.45rem;
		font-size: 0.85rem;
	}
	
	@media (max-width: 1024px) {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}
`;

const MobileMenu = styled.div<{ $open: boolean }>`
	position: absolute;
	top: 100%;
	left: 1rem;
	background: ${props => props.theme.colors.cardSurface};
	color: ${props => props.theme.colors.headings};
	border: 1px solid ${props => props.theme.colors.borders};
	border-radius: 12px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
	padding: 0.5rem;
	display: none; /* disabled dropdown */
	min-width: 220px;
	z-index: 100;
	opacity: 0;
	visibility: hidden;
	transform: translateY(-10px);
	transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
	
	@media (max-width: 768px) {
		min-width: 200px;
		padding: 0.4rem;
		left: 0.75rem;
	}
	
	@media (max-width: 480px) {
		min-width: 180px;
		padding: 0.3rem;
		left: 0.5rem;
	}
	
	@media (max-width: 320px) {
		min-width: 160px;
		padding: 0.25rem;
		left: 0.25rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 1024px) {
		display: none; /* ensure disabled on tablets/phones too */
	}
`;

const MobileItem = styled.a`
	text-decoration: none;
	color: ${props => props.theme.colors.bodyText};
	padding: 0.6rem 0.75rem;
	border-radius: 8px;
	font-size: 0.95rem;
	
	@media (max-width: 480px) {
		padding: 0.5rem 0.6rem;
		font-size: 0.9rem;
	}
	
	@media (max-width: 320px) {
		padding: 0.4rem 0.5rem;
		font-size: 0.85rem;
	}
	
	:hover, :focus-visible { 
		background: rgba(255, 255, 255, 0.06); 
		outline: none; 
		color: ${props => props.theme.colors.headings};
	}
`;

const NotificationBellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ThemeToggleIcon = ({ mode }: { mode: 'dark' | 'light' }) => (
  mode === 'dark' ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
);

type NotificationItem = {
  id: string;
  type: 'application' | 'interview' | 'offer' | 'rejected' | 'document' | 'activity';
  title: string;
  createdAt: string;
};

interface NavbarProps {
  onMenuToggle?: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onMenuToggle }) => {
	const [open, setOpen] = useState(false);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState(''); // Add search query state
	const [showSearchSuggestions, setShowSearchSuggestions] = useState(false); // Add search suggestions state
	const userDropdownRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null); // Add ref for search input
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const { mode, toggleMode } = useThemeMode();
	const { t } = useI18n();

	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);

	const loadNotifications = useCallback(async () => {
		if (!user) return;
		const lastSeenRaw = localStorage.getItem('notifications:lastSeen');
		const lastSeen = lastSeenRaw ? new Date(lastSeenRaw).toISOString() : '1970-01-01T00:00:00.000Z';

		// Documents
		const { data: docs } = await supabase
			.from('documents')
			.select('id, name, created_at')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
			.limit(10);

		// Activities (tasks)
		const { data: acts } = await supabase
			.from('activities')
			.select('id, title, created_at')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false })
			.limit(10);

		// Applications (status/date changes). We infer most recent change timestamp
		const { data: apps } = await supabase
			.from('job_applications')
			.select('id, company_name, position, status, applied_date, interview_date, offer_date, rejected_date, created_at, updated_at')
			.eq('user_id', user.id)
			.order('updated_at', { ascending: false })
			.limit(15);

		const appEvents: NotificationItem[] = (apps || []).map(a => {
			const dates: Array<[string, string]> = [];
			if (a.offer_date) dates.push(['offer', a.offer_date]);
			if (a.rejected_date) dates.push(['rejected', a.rejected_date]);
			if (a.interview_date) dates.push(['interview', a.interview_date]);
			if (a.applied_date) dates.push(['application', a.applied_date]);
			const updated = a.updated_at || a.created_at || (a.applied_date ?? null);
			let type: NotificationItem['type'] = 'application';
			let createdAt = updated || new Date().toISOString();
			if (dates.length > 0) {
				const latest = dates
					.filter(([, d]) => !!d)
					.sort(([, d1], [, d2]) => new Date(d2).getTime() - new Date(d1).getTime())[0];
				if (latest) {
					type = latest[0] as NotificationItem['type'];
					createdAt = latest[1];
				}
			}
			const company = a.company_name || 'Application';
			const role = a.position ? ` – ${a.position}` : '';
			const title =
				type === 'offer' ? `Offer from ${company}${role}` :
				type === 'rejected' ? `Rejected at ${company}${role}` :
				type === 'interview' ? `Interview scheduled at ${company}${role}` :
				`Applied to ${company}${role}`;
			return { id: a.id, type, title, createdAt };
		});

		const docEvents: NotificationItem[] = (docs || []).map(d => ({ id: d.id, type: 'document', title: `Uploaded ${d.name}`, createdAt: d.created_at }));
		const actEvents: NotificationItem[] = (acts || []).map(a => ({ id: a.id, type: 'activity', title: a.title || 'New activity', createdAt: a.created_at }));

		const merged = [...appEvents, ...docEvents, ...actEvents]
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 12);
		setNotifications(merged);
		setUnreadCount(merged.filter(n => n.createdAt > lastSeen).length);
	}, [user]);

	useEffect(() => {
		if (!user) return;
		loadNotifications();
		const channel = supabase
			.channel(`nav-notifs-${user.id}`)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'documents', filter: `user_id=eq.${user.id}` }, () => loadNotifications())
			.on('postgres_changes', { event: '*', schema: 'public', table: 'activities', filter: `user_id=eq.${user.id}` }, () => loadNotifications())
			.on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications', filter: `user_id=eq.${user.id}` }, () => loadNotifications())
			.subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user, loadNotifications]);

	const handleToggleNotifications = () => {
		const next = !notificationsOpen;
		setNotificationsOpen(next);
		if (next) {
			const now = new Date().toISOString();
			localStorage.setItem('notifications:lastSeen', now);
			setUnreadCount(0);
		}
	};

	// Close dropdowns when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			// Type guard for event.target
			if (!(event.target instanceof Element)) return;
			
			if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
				setUserDropdownOpen(false);
			}
			if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
				setNotificationsOpen(false);
			}
			// Close mobile menu when clicking outside
			if (open && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
				setOpen(false);
			}
			// Close search suggestions when clicking outside
			if (showSearchSuggestions && searchInputRef.current && !searchInputRef.current.contains(event.target)) {
				setShowSearchSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open, showSearchSuggestions]);

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

	// Add search handler
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
			setShowSearchSuggestions(false);
		}
	};

	// Add search suggestion click handler
	const handleSuggestionClick = (category: string) => {
		if (searchQuery.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${category}`);
			setShowSearchSuggestions(false);
			setSearchQuery('');
		}
	};

	return (
		<Header>
			<Nav aria-label="Primary" onKeyDown={handleSearchShortcut}>
				<LeftSection>
					<MenuButton onClick={handleMenuToggle}>
						☰
					</MenuButton>
				</LeftSection>
				
				<CenterSection>
					<SearchContainer>
						<SearchIcon>🔍</SearchIcon>
						<form onSubmit={handleSearch}>
							<SearchInput 
								id="search-input"
								ref={searchInputRef}
								type="text" 
								placeholder={t('search.placeholder')} 
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								onFocus={() => setShowSearchSuggestions(true)}
							/>
						</form>
						{showSearchSuggestions && searchQuery.trim() && (
							<SearchSuggestions>
								<SearchCategory>{t('search.suggestions.title')}</SearchCategory>
								<SearchSuggestionItem onClick={() => handleSuggestionClick('applications')}>
									{t('search.suggestions.applications')}
								</SearchSuggestionItem>
								<SearchSuggestionItem onClick={() => handleSuggestionClick('tasks')}>
									{t('search.suggestions.tasks')}
								</SearchSuggestionItem>
								<SearchSuggestionItem onClick={() => handleSuggestionClick('documents')}>
									{t('search.suggestions.documents')}
								</SearchSuggestionItem>
							</SearchSuggestions>
						)}
					</SearchContainer>
				</CenterSection>
				
				<RightSection>
					<IconGroup>
						<IconContainer>
							<IconButton aria-label={t('navbar.toggleTheme')} onClick={toggleMode}>
								<ThemeToggleIcon mode={mode} />
							</IconButton>
						</IconContainer>
						<IconContainer ref={notificationsRef}>
							<IconButton 
								aria-label={t('navbar.notifications')} 
								onClick={handleToggleNotifications}
							>
								<NotificationBellIcon />
								{unreadCount > 0 && <NotificationBadge>{unreadCount > 9 ? '9+' : unreadCount}</NotificationBadge>}
							</IconButton>
							{notificationsOpen && (
								<Dropdown>
									{notifications.length === 0 && (
										<DropdownItem as='div'>{t('navbar.noNotifications')}</DropdownItem>
									)}
									{notifications.map(n => (
										<DropdownItem as="div" key={`${n.type}-${n.id}-${n.createdAt}`}>
											{n.title}
										</DropdownItem>
									))}
								</Dropdown>
							)}
						</IconContainer>
					</IconGroup>
					
					{user ? (
						<IconContainer ref={userDropdownRef}>
							{(() => {
							  const meta = (user?.user_metadata as Record<string, unknown>) || {};
							  const avatarUrl = typeof meta.avatar_url === 'string' ? meta.avatar_url : '';
							  return (
							    <UserAvatar $hasImage={!!avatarUrl} onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
							      {avatarUrl ? (
							        <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
							      ) : (
							        user.email?.charAt(0).toUpperCase() || 'U'
							      )}
							    </UserAvatar>
							  );
							})()}
							{userDropdownOpen && (
									<Dropdown>
										<DropdownLink to="/profile" onClick={() => setUserDropdownOpen(false)}>{t('navbar.settings')}</DropdownLink>
										<Divider />
										<DropdownItem href="#" onClick={handleSignOut}>{t('navbar.signOut')}</DropdownItem>
									</Dropdown>
							)}
						</IconContainer>
					) : (
						<LoginButton href="/signin" aria-label="Sign in">Sign in</LoginButton>
					)}
				</RightSection>
				
				<MobileMenu ref={mobileMenuRef} $open={open}>
					{user ? (
						<>
							<MobileItem href="/dashboard">Dashboard</MobileItem>
							<MobileItem href="/applications">Applications</MobileItem>
							<MobileItem href="/documents">Documents</MobileItem>
							<MobileItem href="/tasks">Tasks</MobileItem>
							<MobileItem href="/insights">Insights</MobileItem>
							<MobileItem href="/profile">Settings</MobileItem>
						</>
					) : (
						<>
							<MobileItem href="/features">Features</MobileItem>
							<MobileItem href="/blog">Blog</MobileItem>
							<MobileItem href="/about">About</MobileItem>
							<MobileItem href="/signin">Sign in</MobileItem>
						</>
					)}
				</MobileMenu>
			</Nav>
		</Header>
	);
};

export default Navbar;