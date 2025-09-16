import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const TasksContainer = styled.div`
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

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.bodyText};
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: ${props => props.$active ? 600 : 400};
  cursor: pointer;
  position: relative;
  
  &:hover {
    color: ${props => props.theme.colors.headings};
  }
  
  ${props => props.$active && `
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
`;

const TaskListContainer = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 1rem;
  width: 1.25rem;
  height: 1.25rem;
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
    font-size: 0.75rem;
  }
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.span<{ $completed?: boolean }>`
  color: ${props => props.$completed ? props.theme.colors.bodyText : props.theme.colors.headings};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  font-size: 1rem;
`;

const TaskDetails = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
`;

const TaskDueDate = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
`;

const TaskApplication = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  text-decoration: underline;
  cursor: pointer;
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
            <Checkbox checked={task.completed} />
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