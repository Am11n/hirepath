import type { FC } from 'react';
import styled from 'styled-components';

const ApplicationsContainer = styled.div`
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

const FiltersContainer = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const FilterHeader = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.headings};
  border: 1px solid ${props => props.theme.colors.borders};
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const TableContainer = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${props => props.theme.colors.borders};
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: ${props => props.theme.colors.bodyText};
  font-weight: 600;
  font-size: 0.9rem;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.headings};
  font-size: 0.95rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'Applied': return 'rgba(59, 130, 246, 0.2)';
      case 'Interview': return 'rgba(139, 92, 246, 0.2)';
      case 'Offer': return 'rgba(34, 197, 94, 0.2)';
      case 'Rejected': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Applied': return props.theme.colors.primary;
      case 'Interview': return props.theme.colors.secondary;
      case 'Offer': return props.theme.colors.success;
      case 'Rejected': return props.theme.colors.error;
      default: return props.theme.colors.bodyText;
    }
  }};
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

const CreateButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const Applications: FC = () => {
  // Mock data for applications
  const applications = [
    {
      id: 1,
      company: 'TechCorp',
      position: 'Frontend Developer',
      date: '2025-09-15',
      status: 'Applied'
    },
    {
      id: 2,
      company: 'InnovateX',
      position: 'UI/UX Designer',
      date: '2025-09-10',
      status: 'Interview'
    },
    {
      id: 3,
      company: 'DataSystems',
      position: 'Data Analyst',
      date: '2025-09-05',
      status: 'Offer'
    },
    {
      id: 4,
      company: 'CloudNet',
      position: 'DevOps Engineer',
      date: '2025-09-01',
      status: 'Rejected'
    }
  ];

  return (
    <ApplicationsContainer>
      <Header>Applications</Header>
      
      <FiltersContainer>
        <FilterHeader>Filters</FilterHeader>
        <FilterOptions>
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect>
              <option>All Statuses</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Company</FilterLabel>
            <FilterSelect>
              <option>All Companies</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Date Range</FilterLabel>
            <FilterSelect>
              <option>All Time</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </FilterSelect>
          </FilterGroup>
        </FilterOptions>
      </FiltersContainer>
      
      <TableContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Company</TableHeader>
              <TableHeader>Position</TableHeader>
              <TableHeader>Date Applied</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {applications.map(app => (
              <TableRow key={app.id}>
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.position}</TableCell>
                <TableCell>{app.date}</TableCell>
                <TableCell>
                  <StatusBadge status={app.status}>{app.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <EmptyStateContainer>
        <EmptyStateTitle>No more applications found</EmptyStateTitle>
        <EmptyStateText>Create a new application to add to your list.</EmptyStateText>
        <CreateButton>Create Application</CreateButton>
      </EmptyStateContainer>
    </ApplicationsContainer>
  );
};

export default Applications;