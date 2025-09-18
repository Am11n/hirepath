import type { FC, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useLocation } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: radial-gradient(900px 500px at 15% 0%, rgba(59, 130, 246, 0.22), transparent 60%),
              radial-gradient(800px 450px at 85% 0%, rgba(168, 85, 247, 0.18), transparent 60%),
              linear-gradient(180deg, #0b1020 0%, #0e1424 50%, #0b1220 100%);
`;

const MainContent = styled.main<{ $sidebarCollapsed?: boolean; $sidebarOpen?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.$sidebarCollapsed ? '70px' : '250px'}; // Width of the sidebar
  transition: margin-left 0.3s ease;
  
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