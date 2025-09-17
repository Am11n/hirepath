import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SearchContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  
  @media (min-width: 480px) {
    padding: 1rem;
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.h1`
  color: ${props => props.theme.colors.headings};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 1.75rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.875rem;
    margin-bottom: 2rem;
  }
`;

const SearchResultsContainer = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  margin-bottom: 1rem;
  gap: 0.25rem;
  
  @media (min-width: 480px) {
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
    gap: 0;
  }
`;

const Tab = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bodyText};
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: ${props => props.$active ? 600 : 400};
  cursor: pointer;
  position: relative;
  border-radius: 6px;
  
  &:hover {
    color: ${props => props.theme.colors.headings};
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  ${props => props.$active && `
    background-color: rgba(59, 130, 246, 0.1);
  `}
  
  @media (min-width: 480px) {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    
    &:hover {
      background-color: transparent;
    }
    
    ${props => props.$active && `
      background-color: transparent;
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: ${props.theme.colors.primary};
      }
    `}
  }
`;

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ResultItem = styled.div`
  padding: 1rem;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid ${props => props.theme.colors.borders};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const ResultTitle = styled.h3`
  color: ${props => props.theme.colors.headings};
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  
  @media (min-width: 480px) {
    font-size: 1.2rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ResultDescription = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ResultMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.bodyText};
  
  @media (min-width: 480px) {
    font-size: 0.85rem;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.bodyText};
  
  @media (min-width: 480px) {
    padding: 3rem;
  }
  
  @media (min-width: 768px) {
    padding: 4rem;
  }
`;

const NoResultsTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const NoResultsText = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 480px) {
    font-size: 1.1rem;
  }
`;

export const Search: FC = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  type SearchResultItem = {
    id: number;
    title: string;
    description: string;
    type: string;
    date: string;
    status: string;
  };

  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    const category = params.get('category') || 'all';
    
    setSearchQuery(query);
    setActiveTab(category);
    
    // Mock search results - in a real app, this would come from an API
    const mockResults = [
      {
        id: 1,
        title: 'TechCorp Frontend Developer Application',
        description: 'Application submitted for Frontend Developer position at TechCorp',
        type: 'application',
        date: '2025-09-15',
        status: 'Interview Scheduled'
      },
      {
        id: 2,
        title: 'Prepare portfolio for TechCorp interview',
        description: 'Task to prepare portfolio for upcoming TechCorp interview',
        type: 'task',
        date: '2025-09-20',
        status: 'Pending'
      },
      {
        id: 3,
        title: 'CV_TechCorp_Application.pdf',
        description: 'Curriculum vitae for TechCorp application',
        type: 'document',
        date: '2025-09-15',
        status: 'Uploaded'
      }
    ];
    
    setSearchResults(mockResults);
  }, [location.search]);

  // Filter results based on active tab
  const filteredResults = activeTab === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === activeTab);

  return (
    <SearchContainer>
      <Header>Search Results for "{searchQuery}"</Header>
      
      <SearchResultsContainer>
        <TabsContainer>
          <Tab $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All</Tab>
          <Tab $active={activeTab === 'applications'} onClick={() => setActiveTab('applications')}>Applications</Tab>
          <Tab $active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')}>Tasks</Tab>
          <Tab $active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>Documents</Tab>
        </TabsContainer>
        
        {filteredResults.length > 0 ? (
          <ResultsList>
            {filteredResults.map(result => (
              <ResultItem key={result.id}>
                <ResultTitle>{result.title}</ResultTitle>
                <ResultDescription>{result.description}</ResultDescription>
                <ResultMeta>
                  <span>{result.date}</span>
                  <span>{result.status}</span>
                </ResultMeta>
              </ResultItem>
            ))}
          </ResultsList>
        ) : (
          <NoResults>
            <NoResultsTitle>No results found</NoResultsTitle>
            <NoResultsText>Try adjusting your search terms or browse through different categories.</NoResultsText>
          </NoResults>
        )}
      </SearchResultsContainer>
    </SearchContainer>
  );
};

export default Search;