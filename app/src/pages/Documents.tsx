import type { FC } from 'react';
import styled from 'styled-components';

const DocumentsContainer = styled.div`
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

const UploadArea = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border: 2px dashed ${props => props.theme.colors.borders};
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(59, 130, 246, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${props => props.theme.colors.bodyText};
  margin-bottom: 1rem;
`;

const UploadTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const UploadButton = styled.button`
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

const DocumentsListContainer = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  margin-bottom: 2rem;
  
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

const DocumentName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DocumentIcon = styled.span`
  font-size: 1.25rem;
`;

const DocumentLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DocumentType = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.2);
  color: ${props => props.theme.colors.primary};
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

export const Documents: FC = () => {
  // Mock data for documents
  const documents = [
    {
      id: 1,
      name: 'CV_TechCorp_Application.pdf',
      type: 'PDF',
      application: 'TechCorp - Frontend Developer',
      lastUpdated: '2025-09-15'
    },
    {
      id: 2,
      name: 'Portfolio_InnovateX.zip',
      type: 'ZIP',
      application: 'InnovateX - UI/UX Designer',
      lastUpdated: '2025-09-12'
    },
    {
      id: 3,
      name: 'Cover_Letter_DataSystems.docx',
      type: 'DOCX',
      application: 'DataSystems - Data Analyst',
      lastUpdated: '2025-09-10'
    },
    {
      id: 4,
      name: 'References_CloudNet.pdf',
      type: 'PDF',
      application: 'CloudNet - DevOps Engineer',
      lastUpdated: '2025-09-08'
    }
  ];

  return (
    <DocumentsContainer>
      <Header>Documents</Header>
      
      <UploadArea>
        <UploadIcon>📁</UploadIcon>
        <UploadTitle>Drag & drop files here</UploadTitle>
        <UploadText>or click the button below to upload documents</UploadText>
        <UploadButton>Select Files</UploadButton>
      </UploadArea>
      
      <DocumentsListContainer>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>Name</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Linked Application</TableHeader>
              <TableHeader>Last Updated</TableHeader>
            </tr>
          </TableHead>
          <TableBody>
            {documents.map(doc => (
              <TableRow key={doc.id}>
                <TableCell>
                  <DocumentName>
                    <DocumentIcon>📄</DocumentIcon>
                    <DocumentLink href="#">{doc.name}</DocumentLink>
                  </DocumentName>
                </TableCell>
                <TableCell>
                  <DocumentType>{doc.type}</DocumentType>
                </TableCell>
                <TableCell>{doc.application}</TableCell>
                <TableCell>{doc.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DocumentsListContainer>
      
      <EmptyStateContainer>
        <EmptyStateTitle>No more documents found</EmptyStateTitle>
        <EmptyStateText>Upload more documents to keep your job search organized.</EmptyStateText>
      </EmptyStateContainer>
    </DocumentsContainer>
  );
};

export default Documents;