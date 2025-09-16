import type { FC } from 'react';
import styled from 'styled-components';

const InsightsContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.h1`
  color: ${props => props.theme.colors.headings};
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 100%;
`;

const InsightCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const CardHeader = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
`;

const PlaceholderChart = styled.div`
  height: 200px;
  background: linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.1));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.bodyText};
`;

const EmptyStateContainer = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 3rem;
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 1rem;
  margin-bottom: 2rem;
`;

export const Insights: FC = () => {
  return (
    <InsightsContainer>
      <Header>Insights</Header>
      
      <CardsContainer>
        <InsightCard>
          <CardHeader>Success Rate Over Time</CardHeader>
          <PlaceholderChart>Chart visualization will appear here</PlaceholderChart>
        </InsightCard>
        
        <InsightCard>
          <CardHeader>Average Response Time</CardHeader>
          <PlaceholderChart>Chart visualization will appear here</PlaceholderChart>
        </InsightCard>
        
        <InsightCard>
          <CardHeader>Applications by Channel</CardHeader>
          <PlaceholderChart>Chart visualization will appear here</PlaceholderChart>
        </InsightCard>
      </CardsContainer>
      
      <EmptyStateContainer>
        <EmptyStateTitle>No insights data available</EmptyStateTitle>
        <EmptyStateText>Insights will be generated as you use the application.</EmptyStateText>
      </EmptyStateContainer>
    </InsightsContainer>
  );
};

export default Insights;