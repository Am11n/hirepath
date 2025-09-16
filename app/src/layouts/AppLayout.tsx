import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`;

const MainContent = styled.main<{ $sidebarCollapsed?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.$sidebarCollapsed ? '70px' : '250px'}; // Width of the sidebar
  transition: margin-left 0.3s ease;
  
  @media (max-width: 1024px) {
    margin-left: 0;
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

  return (
    <LayoutContainer>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        collapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <MainContent $sidebarCollapsed={sidebarCollapsed}>
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};