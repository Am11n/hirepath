import type { FC, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useLocation } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  overflow-x: hidden; /* prevent horizontal scroll on mobile */
  background: radial-gradient(900px 500px at 15% 0%, ${props => props.theme.gradients.primaryGlow}, transparent 60%),
              radial-gradient(800px 450px at 85% 0%, ${props => props.theme.gradients.secondaryGlow}, transparent 60%),
              linear-gradient(180deg, ${props => props.theme.gradients.baseStart} 0%, ${props => props.theme.gradients.baseMid} 50%, ${props => props.theme.gradients.baseEnd} 100%);
`;

const MainContent = styled.main<{ $sidebarCollapsed?: boolean; $sidebarOpen?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.$sidebarCollapsed ? '70px' : '250px'}; // Width of the sidebar
  transition: margin-left 0.3s ease;
  overflow-x: hidden; /* ensure children don't cause horizontal scroll */
  
  @media (max-width: 1024px) {
    margin-left: 0; // default on mobile/tablet
  }
  
  /* Tablet: if sidebar is open, reserve drawer width */
  @media (min-width: 641px) and (max-width: 1024px) {
    margin-left: ${props => props.$sidebarOpen ? '320px' : '0'};
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Auto-close sidebar on route change for widths <= 1024px
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <LayoutContainer>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        collapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <MainContent $sidebarCollapsed={sidebarCollapsed} $sidebarOpen={sidebarOpen}>
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};