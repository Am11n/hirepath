import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const TasksContainer = styled.div`
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

const TaskListContainer = styled.div`
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

const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (min-width: 480px) {
    padding: 1rem 0;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.borders};
  background-color: rgba(255, 255, 255, 0.05);
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:checked {
    background-color: ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary};
  }
  
  &:checked::after {
    content: '✓';
    color: white;
    font-size: 0.65rem;
  }
  
  @media (min-width: 480px) {
    margin-right: 1rem;
    width: 1.25rem;
    height: 1.25rem;
    
    &:checked::after {
      font-size: 0.75rem;
    }
  }
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.span<{ $completed?: boolean }>`
  color: ${props => props.$completed ? props.theme.colors.bodyText : props.theme.colors.headings};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  font-size: 0.9rem;
  display: block;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const TaskDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    gap: 0.75rem;
    margin-top: 0.375rem;
  }
  
  @media (min-width: 768px) {
    gap: 1rem;
    margin-top: 0.25rem;
  }
`;

const TaskDueDate = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.8rem;
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const TaskApplication = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 0.8rem;
  text-decoration: underline;
  cursor: pointer;
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const EmptyStateContainer = styled.div`
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  text-align: center;
  
  @media (min-width: 480px) {
    padding: 2rem;
  }
  
  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 3rem;
  }
`;

const EmptyStateTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  
  @media (min-width: 480px) {
    font-size: 1.375rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const EmptyStateText = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
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
    padding: 0.7rem 1.4rem;
    font-size: 0.95rem;
  }
  
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 10px;
  }
`;

export const Tasks: FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  // Mock data for tasks
  const tasks = [
    {
      id: 1,
      title: 'Prepare portfolio for TechCorp interview',
      completed: false,
      dueDate: '2025-09-20',
      application: 'TechCorp - Frontend Developer'
    },
    {
      id: 2,
      title: 'Follow up with InnovateX recruiter',
      completed: true,
      dueDate: '2025-09-18',
      application: 'InnovateX - UI/UX Designer'
    },
    {
      id: 3,
      title: 'Review job description for DataSystems',
      completed: false,
      dueDate: '2025-09-15',
      application: 'DataSystems - Data Analyst'
    },
    {
      id: 4,
      title: 'Update resume with latest projects',
      completed: false,
      dueDate: '2025-09-10',
      application: 'General Task'
    }
  ];

  return (
    <TasksContainer>
      <Header>Tasks</Header>
      
      <TabsContainer>
        <Tab $active={activeTab === 'All'} onClick={() => setActiveTab('All')}>All</Tab>
        <Tab $active={activeTab === 'Due Today'} onClick={() => setActiveTab('Due Today')}>Due Today</Tab>
        <Tab $active={activeTab === 'Overdue'} onClick={() => setActiveTab('Overdue')}>Overdue</Tab>
        <Tab $active={activeTab === 'Completed'} onClick={() => setActiveTab('Completed')}>Completed</Tab>
      </TabsContainer>
      
      <TaskListContainer>
        {tasks.map(task => (
          <TaskItem key={task.id}>
            <Checkbox defaultChecked={task.completed} />
            <TaskContent>
              <TaskTitle $completed={task.completed}>{task.title}</TaskTitle>
              <TaskDetails>
                <TaskDueDate>Due: {task.dueDate}</TaskDueDate>
                <TaskApplication>{task.application}</TaskApplication>
              </TaskDetails>
            </TaskContent>
          </TaskItem>
        ))}
      </TaskListContainer>
      
      <EmptyStateContainer>
        <EmptyStateTitle>No more tasks found</EmptyStateTitle>
        <EmptyStateText>Add a new task to stay organized.</EmptyStateText>
        <CreateButton>Create Task</CreateButton>
      </EmptyStateContainer>
    </TasksContainer>
  );
};

export default Tasks;