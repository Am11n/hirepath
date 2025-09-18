import type { FC } from 'react';
import styled from 'styled-components';

const DocumentsContainer = styled.div`
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
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.875rem;
    margin-bottom: 2rem;
  }
`;

const UploadArea = styled.div`
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: saturate(120%) blur(6px);
  border: 2px dashed ${props => props.theme.colors.borders};
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: rgba(59, 130, 246, 0.05);
  }
  
  @media (min-width: 480px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;

const UploadIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.bodyText};
  margin-bottom: 0.75rem;
  
  @media (min-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 3rem;
  }
`;

const UploadTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const UploadText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const UploadButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (min-width: 480px) {
    width: auto;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 10px;
  }
`;

const DocumentsListContainer = styled.div`
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: saturate(120%) blur(6px);
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

// New responsive table container
const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  
  @media (max-width: 767px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
  
  @media (min-width: 320px) {
    font-size: 0.8rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
  
  @media (min-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${props => props.theme.colors.borders};
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 0.5rem;
  color: ${props => props.theme.colors.bodyText};
  font-weight: 600;
  font-size: 0.7rem;
  
  @media (min-width: 320px) {
    padding: 0.6rem;
    font-size: 0.75rem;
  }
  
  @media (min-width: 480px) {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 0.95rem;
  }
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
  
  @media (min-width: 480px) {
    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }
`;

const TableCell = styled.td`
  padding: 0.5rem;
  color: ${props => props.theme.colors.headings};
  font-size: 0.75rem;
  
  @media (min-width: 320px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
  
  @media (min-width: 480px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
  
  @media (min-width: 768px) {
    padding: 1rem;
    font-size: 0.95rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
  }
`;

const DocumentName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 480px) {
    gap: 0.625rem;
  }
  
  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const DocumentIcon = styled.span`
  font-size: 1rem;
  
  @media (min-width: 480px) {
    font-size: 1.125rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`;

const DocumentLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.75rem;
  display: block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (min-width: 320px) {
    font-size: 0.8rem;
    max-width: 140px;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
    max-width: 160px;
  }
  
  @media (min-width: 768px) {
    font-size: 0.95rem;
    max-width: 200px;
  }
  
  @media (min-width: 1024px) {
    font-size: 1rem;
    max-width: none;
  }
`;

const DocumentType = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.6rem;
  font-weight: 600;
  
  @media (min-width: 320px) {
    padding: 0.15rem 0.55rem;
    font-size: 0.65rem;
  }
  
  @media (min-width: 480px) {
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
  }
  
  background: rgba(59, 130, 246, 0.2);
  color: ${props => props.theme.colors.primary};
`;

// Mobile view styles
const MobileDocumentsList = styled.div`
  display: none;
  
  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const DocumentCard = styled.div`
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0,0,0,.25);
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
`;

const DocumentCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const DocumentCardTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DocumentCardName = styled.a`
  color: ${props => props.theme.colors.headings};
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  @media (min-width: 480px) {
    font-size: 1.1rem;
  }
`;

const DocumentCardType = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.2);
  color: ${props => props.theme.colors.primary};
  width: fit-content;
`;

const DocumentCardDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  
  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

const DocumentDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DocumentDetailLabel = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.8rem;
`;

const DocumentDetailValue = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.9rem;
  font-weight: 500;
`;

const EmptyStateContainer = styled.div`
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  text-align: center;
  
  @media (min-width: 480px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 2rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem;
  }
`;

const EmptyStateTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  @media (min-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
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
        {/* Desktop table view */}
        <TableContainer>
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
        </TableContainer>
        
        {/* Mobile card view */}
        <MobileDocumentsList>
          {documents.map(doc => (
            <DocumentCard key={doc.id}>
              <DocumentCardHeader>
                <DocumentIcon>📄</DocumentIcon>
                <DocumentCardTitle>
                  <DocumentCardName href="#">{doc.name}</DocumentCardName>
                  <DocumentCardType>{doc.type}</DocumentCardType>
                </DocumentCardTitle>
              </DocumentCardHeader>
              <DocumentCardDetails>
                <DocumentDetail>
                  <DocumentDetailLabel>Linked Application</DocumentDetailLabel>
                  <DocumentDetailValue>{doc.application}</DocumentDetailValue>
                </DocumentDetail>
                <DocumentDetail>
                  <DocumentDetailLabel>Last Updated</DocumentDetailLabel>
                  <DocumentDetailValue>{doc.lastUpdated}</DocumentDetailValue>
                </DocumentDetail>
              </DocumentCardDetails>
            </DocumentCard>
          ))}
        </MobileDocumentsList>
      </DocumentsListContainer>
      
      <EmptyStateContainer>
        <EmptyStateTitle>No more documents found</EmptyStateTitle>
        <EmptyStateText>Upload more documents to keep your job search organized.</EmptyStateText>
      </EmptyStateContainer>
    </DocumentsContainer>
  );
};

export default Documents;