import type { FC } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeMode } from '../contexts/themeMode';

const SidebarContainer = styled.div<{ $isOpen?: boolean; $collapsed?: boolean }>`
  width: ${props => props.$collapsed ? '70px' : '250px'};
  background-color: ${props => props.theme.glass.sidebar};
  backdrop-filter: saturate(120%) blur(6px);
  color: ${props => props.theme.colors.bodyText};
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  border-right: 1px solid ${props => props.theme.colors.borders};
  padding: 0;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.3s ease;
  
  /* Phones: full-screen overlay */
  @media (max-width: 640px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    width: 100%;
    background-color: ${props => props.theme.glass.drawer};
    backdrop-filter: saturate(120%) blur(8px);
  }
  
  /* Tablets: drawer with fixed width */
  @media (min-width: 641px) and (max-width: 1024px) {
    display: ${props => props.$isOpen ? 'flex' : 'none'};
    width: 320px;
    background-color: ${props => props.theme.glass.sidebar};
    backdrop-filter: saturate(120%) blur(6px);
    box-shadow: 10px 0 30px rgba(0,0,0,0.35);
  }
`;

const LogoContainer = styled.div<{ $collapsed?: boolean }>`
  height: 72px; /* match navbar visual height */
  padding: 0 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  margin-bottom: 0;
  display: ${props => props.$collapsed ? 'none' : 'flex'};
  justify-content: center;
  align-items: center;
  
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const Logo = styled.img`
  height: 50px;
  width: auto;
`;

const CollapsedLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px; /* match navbar visual height */
  padding: 0 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  margin-bottom: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const CollapsedLogo = styled.img`
  height: 50px; /* match expanded logo size */
  width: auto;
`;

const CollapseButton = styled.button<{ $collapsed?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.theme.colors.bodyText};
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  border-top: 1px solid ${props => props.theme.colors.borders};
  border-radius: 4px;
  margin-top: 0.5rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.headings};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: -2px;
  }
  
  svg {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
  }
  
  span {
    display: ${props => props.$collapsed ? 'none' : 'inline'};
  }
  
  @media (max-width: 1024px) {
    span {
      display: inline;
    }
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled.li`
  margin: 0;
`;

const NavLink = styled.a<{ $active?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bodyText};
  font-size: 0.95rem;
  transition: all 0.2s ease;
  border-left: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  white-space: nowrap;
  overflow: hidden;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.headings};
  }
  
  svg {
    margin-right: ${props => props.$collapsed ? '0' : '0.75rem'};
    width: 20px;
    height: 20px;
    min-width: 20px;
  }
  
  span {
    display: ${props => props.$collapsed ? 'none' : 'inline'};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 1024px) {
    span {
      display: inline;
    }
    
    svg {
      margin-right: 0.75rem;
    }
  }
`;

const BottomSection = styled.div<{ $collapsed?: boolean }>`
  padding: 0 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.borders};
  display: block;
  margin-top: auto;
  margin-bottom: 1rem;
  
  @media (max-width: 1024px) {
    display: block;
  }
`;

// Simple SVG icons as placeholders
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ApplicationsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const TasksIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2z" />
  </svg>
);

const DocumentsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const InsightsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2z" />
  </svg>
);


const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="16" height="16">
    {collapsed ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    )}
  </svg>
);

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ 
  isOpen = false, 
  onClose, 
  collapsed = false, 
  onCollapseToggle 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useThemeMode();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Applications', path: '/applications', icon: <ApplicationsIcon /> },
    { name: 'Tasks', path: '/tasks', icon: <TasksIcon /> },
    { name: 'Documents', path: '/documents', icon: <DocumentsIcon /> },
    { name: 'Insights', path: '/insights', icon: <InsightsIcon /> },
  ];

  const handleCollapseToggle = () => {
    // On mobile, the button should only close the sidebar
    if (window.innerWidth <= 1024) {
      if (onClose) onClose();
    } else {
      // Desktop behavior remains the same
      if (onCollapseToggle) onCollapseToggle();
    }
  };

  const expandedLogoSrc = mode === 'light'
    ? encodeURI('/images/Logo med tekst(FOR LYS).svg')
    : '/HirePath-ForMørkBakgrunn (1).png';

  return (
    <SidebarContainer $isOpen={isOpen} $collapsed={collapsed}>
      <LogoContainer $collapsed={collapsed}>
        <Logo src={expandedLogoSrc} alt="HirePath" />
      </LogoContainer>
      
      {collapsed && (
        <CollapsedLogoWrapper>
          <CollapsedLogo src={encodeURI('/images/Logo uten navn-HirePath.svg')} alt="HirePath" />
        </CollapsedLogoWrapper>
      )}
      
      <NavList>
        {menuItems.map((item) => (
          <NavItem key={item.path}>
            <NavLink 
              href="#" 
              $active={location.pathname === item.path}
              $collapsed={collapsed}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                if (onClose) onClose();
              }}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </NavItem>
        ))}
      </NavList>
      
      <BottomSection>
        <CollapseButton $collapsed={collapsed} onClick={handleCollapseToggle}>
          {window.innerWidth <= 1024 ? (
            <>
              <CollapseIcon collapsed={true} />
              <span>Collapse</span>
            </>
          ) : (
            <>
              <CollapseIcon collapsed={collapsed} />
              <span>{collapsed ? 'Expand' : 'Collapse'}</span>
            </>
          )}
        </CollapseButton>
      </BottomSection>
    </SidebarContainer>
  );
};

export default Sidebar;