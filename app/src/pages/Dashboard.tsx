import type { FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';
import { kpiData, applicationsOverTimeData, tasksCompletedData, upcomingReminders, followUpsNeeded, recentActivity } from '../data/mock';

// Define types for our data structures (removed unused types)

// Removed unused interfaces (KpiData, ApplicationDataPoint, TaskDataPoint, Reminder, FollowUp, Activity)
// to satisfy lint rules and keep the file lean.

// Styled components with enhanced mobile responsiveness
const DashboardContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.25rem;
  }
  
  @media (min-width: 480px) {
    padding: 1rem;
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

// Add new styled components for the enhancements
const NotificationBanner = styled.div`
  background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.75rem;
    border-radius: 10px;
  }
  
  @media (min-width: 480px) {
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 768px) {
    padding: 1.25rem 1.5rem;
    margin-bottom: 2rem;
  }
`;

const NotificationContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NotificationIcon = styled.span`
  font-size: 1.25rem;
`;

const NotificationText = styled.span`
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
  }
  
  @media (min-width: 480px) {
    font-size: 1rem;
  }
`;

const NotificationClose = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

const WelcomeCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  
  // Add neon glow effect
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
    // Add subtle glow to the gradient line
    box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
  }
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    border-radius: 16px;
  }
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
    margin-bottom: 2rem;
  }
`;

const WelcomeHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    margin-bottom: 0.5rem;
    gap: 0.25rem;
  }
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 1rem;
  }
`;

const WelcomeTitle = styled.h1`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 1.125rem;
  }
  
  @media (min-width: 480px) {
    font-size: 1.5rem;
  }
  
  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const WelcomeSubtitle = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
  margin: 0;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
  }
  
  @media (min-width: 480px) {
    font-size: 1rem;
    margin: 0.5rem 0 0 0;
  }
`;

// Add styled component for the interview details link
const InterviewDetailsLink = styled.a`
  color: ${props => props.theme.colors.primary};
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
    margin-top: 0.125rem;
    gap: 0.125rem;
  }
  
  
  @media (min-width: 480px) {
    font-size: 1rem;
    margin-top: 0.5rem;
  }
`;

const NextInterviewPill = styled.span`
  background: rgba(59, 130, 246, 0.2);
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.125rem 0.5rem;
    font-size: 0.6875rem;
    border-radius: 16px;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 100%;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const KpiCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  
  // Add subtle glow effect
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
  
  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
    // Enhance glow on hover
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 0 2px ${props => props.theme.colors.primary};
  }
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.75rem;
    border-radius: 12px;
  }
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`;

const KpiHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  width: 100%;
  min-height: 32px;
  position: relative;
  
  @media (min-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const KpiValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.headings};
  margin-bottom: 0.25rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 1.25rem;
    margin-bottom: 0.125rem;
  }
  
  @media (min-width: 480px) {
    font-size: 1.75rem;
  }
  
  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const KpiLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.bodyText};
  margin-bottom: 0.25rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
    margin-bottom: 0.125rem;
  }
  
  @media (min-width: 480px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const KpiChange = styled.div<{ positive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.warning};
  font-weight: 600;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.6875rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const TrendIcon = styled.span`
  margin-left: 0.25rem;
`;

// Add styled component for swipeable chart container
const SwipeableChartContainer = styled.div`
  overflow-x: auto;
  width: 100%;
  padding: 0.5rem 0;
  
  /* Hide scrollbar for webkit browsers */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
  
  /* Improve mobile responsiveness */
  @media (max-width: 360px) {
    padding: 0.25rem 0;
  }
  
  @media (max-width: 320px) {
    padding: 0.125rem 0;
  }
  
  @media (min-width: 768px) {
    overflow-x: visible;
  }
`;

const ChartCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  
  // Add subtle glow effect
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.75rem;
    border-radius: 12px;
  }
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`;

const ChartTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 1rem;
    margin: 0 0 0.75rem 0;
  }
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
    margin: 0 0 1.5rem 0;
  }
`;

const ChartsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 100%;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const InsightsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    gap: 0.75rem;
  }
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
`;

const InsightsCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  
  // Add subtle glow effect
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.75rem;
    border-radius: 12px;
  }
  
  @media (min-width: 480px) {
    padding: 1.25rem;
  }
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
`;

const InsightsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
`;

const InsightsTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 1rem;
  }
  
  @media (min-width: 480px) {
    font-size: 1.25rem;
  }
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8125rem;
    border-radius: 4px;
  }
  
  @media (min-width: 480px) {
    width: auto;
    padding: 0.5rem 1rem;
  }
`;

const ContactButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.15rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    padding: 0.2rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightsItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (min-width: 480px) {
    padding: 0.75rem 0;
  }
`;

const ReminderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }
`;

const ReminderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReminderTitle = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.9rem;
  margin-bottom: 0.125rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
    margin-bottom: 0.0625rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
`;

const ReminderTime = styled.span<{ status?: string }>`
  color: ${props => {
    if (props.status === 'overdue') return props.theme.colors.error;
    if (props.status === 'due-soon') return props.theme.colors.warning;
    return props.theme.colors.bodyText;
  }};
  font-size: 0.8rem;
  font-weight: ${props => props.status ? '600' : 'normal'};
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const FollowUpItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  
  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
  }
`;

const FollowUpContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const FollowUpCompany = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.9rem;
  margin-bottom: 0.125rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
    margin-bottom: 0.0625rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
`;

const FollowUpDate = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.8rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0.375rem 0;
  
  @media (min-width: 480px) {
    padding: 0.5rem 0;
  }
`;

const ActivityIcon = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 480px) {
    margin-right: 0.75rem;
  }
`;

const ActivityIconWrapper = styled.div<{ type: string }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.2); /* Blue background for all icons */
  color: ${props => props.theme.colors.primary}; /* Blue color for all icons */
  
  @media (min-width: 480px) {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityAction = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.125rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.8125rem;
    margin-bottom: 0.0625rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 0.25rem;
  }
`;

const ActivityTime = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.8rem;
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
  
  @media (min-width: 480px) {
    font-size: 0.875rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.375rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
  
  @media (min-width: 480px) {
    gap: 0.5rem;
    margin-top: 1rem;
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.bodyText};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.borders};
  border-radius: 20px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : 'rgba(255, 255, 255, 0.05)'};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    padding: 0.15rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 16px;
  }
  
  @media (min-width: 480px) {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
`;

// SVG Icon Components
const BriefcaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V19H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 15L10 10L13 13L17 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Activity Icon Components
const DocumentActivityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const InterviewActivityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
    <line x1="12" y1="19" x2="12" y2="15"></line>
  </svg>
);

const ApplicationActivityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
    <polyline points="16 11 12 15 8 11"></polyline>
  </svg>
);

const CommunicationActivityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Styled component for legend text to ensure white color
const LegendText = styled.span`
  color: #FFFFFF !important;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  text-shadow: 0 0 1px rgba(0,0,0,0.5);
  
  /* Improve mobile responsiveness for small screens */
  @media (max-width: 360px) {
    font-size: 10px;
  }
  
  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

// Custom Legend component with colored text
const CustomLegend = (props: { payload?: Array<{ value: string; color: string }> }) => {
  // Handle both Recharts payload and manual payload
  const payload = props.payload || [];
  
  // Return null if no payload
  if (!payload || payload.length === 0) return null;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
      {payload.map((entry, index) => {
        // Use the color from the entry
        const color = entry.color || '#FFFFFF';
        
        return (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: '15px', marginBottom: '5px' }}>
            <div 
              style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: color, 
                marginRight: '5px',
                borderRadius: '2px'
              }} 
            />
            <LegendText>
              {entry.value}
            </LegendText>
          </div>
        );
      })}
    </div>
  );
};

export const Dashboard: FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth(); // Not used currently
  const [showNotification, setShowNotification] = useState(true);
  
  // Function to get personalized welcome message based on day and interview status
  const getWelcomeMessage = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    
    // Check if there's an interview today (in a real app, this would come from the database)
    // For demo purposes, let's check if today is Tuesday (matching the "Next interview: Tue 10:30")
    const hasInterviewToday = dayOfWeek === 2; // Tuesday
    
    if (hasInterviewToday) {
      return "Good luck with your meeting today!";
    }
    
    switch (dayOfWeek) {
      case 1: // Monday
        return "Plan your week ahead.";
      case 5: // Friday
        return "3 reminders before the weekend.";
      default:
        return "Here's your job search overview.";
    }
  };

  const handleKpiClick = (path: string) => {
    navigate(path);
  };

  // Function to get the appropriate activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <DocumentActivityIcon />;
      case 'interview':
        return <InterviewActivityIcon />;
      case 'application':
        return <ApplicationActivityIcon />;
      case 'communication':
        return <CommunicationActivityIcon />;
      default:
        return <DocumentActivityIcon />;
    }
  };

  // Search handler is not used in UI yet

  return (
    <DashboardContainer>
      {/* Add notification banner */}
      {showNotification && (
        <NotificationBanner>
          <NotificationContent>
            <NotificationIcon>🔔</NotificationIcon>
            <NotificationText>3 new interview invitations received today!</NotificationText>
          </NotificationContent>
          <NotificationClose onClick={() => setShowNotification(false)}>
            ×
          </NotificationClose>
        </NotificationBanner>
      )}

      <WelcomeCard>
        <WelcomeHeader>
          <div>
            <WelcomeTitle>Welcome back</WelcomeTitle>
            <WelcomeSubtitle>{getWelcomeMessage()}</WelcomeSubtitle>
          </div>
          <div>
            <NextInterviewPill>Next interview: Tue 10:30</NextInterviewPill>
            <InterviewDetailsLink href="#" onClick={(e) => {
              e.preventDefault();
              // In a real app, this would open the interview in a calendar
              alert('Opening interview details in calendar...');
            }}>
              View details →
            </InterviewDetailsLink>
          </div>
        </WelcomeHeader>
      </WelcomeCard>

      <KpiGrid>
        <KpiCard onClick={() => handleKpiClick('/applications')}>
          <KpiHeader>
            <BriefcaseIcon />
          </KpiHeader>
          <KpiValue>{kpiData.applicationsSubmitted.value}</KpiValue>
          <KpiLabel>Applications Submitted</KpiLabel>
          <KpiChange positive={kpiData.applicationsSubmitted.changePositive}>
            {kpiData.applicationsSubmitted.change}
            <TrendIcon>{kpiData.applicationsSubmitted.changePositive ? '↗' : '↘'}</TrendIcon>
          </KpiChange>
        </KpiCard>
        
        <KpiCard onClick={() => handleKpiClick('/applications')}>
          <KpiHeader>
            <CalendarIcon />
          </KpiHeader>
          <KpiValue>{kpiData.interviewsScheduled.value}</KpiValue>
          <KpiLabel>Interviews Scheduled</KpiLabel>
          <KpiChange positive={kpiData.interviewsScheduled.changePositive}>
            {kpiData.interviewsScheduled.change}
            <TrendIcon>{kpiData.interviewsScheduled.changePositive ? '↗' : '↘'}</TrendIcon>
          </KpiChange>
        </KpiCard>
        
        <KpiCard onClick={() => handleKpiClick('/documents')}>
          <KpiHeader>
            <DocumentIcon />
          </KpiHeader>
          <KpiValue>{kpiData.documentsUploaded.value}</KpiValue>
          <KpiLabel>Documents Uploaded</KpiLabel>
          <KpiChange positive={kpiData.documentsUploaded.changePositive}>
            {kpiData.documentsUploaded.change}
            <TrendIcon>{kpiData.documentsUploaded.changePositive ? '↗' : '↘'}</TrendIcon>
          </KpiChange>
        </KpiCard>
        
        <KpiCard onClick={() => handleKpiClick('/insights')}>
          <KpiHeader>
            <ChartIcon />
          </KpiHeader>
          <KpiValue>{kpiData.successRate.value}%</KpiValue>
          <KpiLabel>Success Rate</KpiLabel>
          <KpiChange positive={kpiData.successRate.changePositive}>
            {kpiData.successRate.change}
            <TrendIcon>{kpiData.successRate.changePositive ? '↗' : '↘'}</TrendIcon>
          </KpiChange>
        </KpiCard>
      </KpiGrid>

      <ChartsRow>
        <ChartCard>
          <ChartTitle>Applications over time</ChartTitle>
          <SwipeableChartContainer>
            <div style={{ width: '100%', minWidth: '280px', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={applicationsOverTimeData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#B0B8C1" 
                    tick={{ fill: '#B0B8C1', fontSize: 12 }} 
                  />
                  <YAxis 
                    stroke="#B0B8C1" 
                    tick={{ fill: '#B0B8C1', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#151A24', 
                      borderColor: '#2D3748',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`${value} applications`, 'Applications']}
                    labelFormatter={(label) => `Week: ${label}`}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  {/* Removed default Legend and will add custom legend below */}
                  <ReferenceLine 
                    y={10} 
                    stroke="#EF4444" 
                    strokeDasharray="3 3"
                  >
                    <Label 
                      value="Goal: 10/week" 
                      position="top" 
                      fill="#EF4444" 
                      fontSize={10}
                    />
                  </ReferenceLine>
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3B82F6" 
                    activeDot={{ r: 6 }} 
                    strokeWidth={2}
                    name="Applications"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SwipeableChartContainer>
          {/* Custom legend for Applications over time chart */}
          <CustomLegend 
            payload={[
              { value: 'Applications', color: '#3B82F6' }
            ]} 
          />
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>Tasks Completed vs Pending</ChartTitle>
          <SwipeableChartContainer>
            <div style={{ width: '100%', minWidth: '280px', height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tasksCompletedData}
                  margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                  <XAxis 
                    dataKey="week" 
                    stroke="#B0B8C1" 
                    tick={{ fill: '#B0B8C1', fontSize: 12 }} 
                  />
                  <YAxis 
                    stroke="#B0B8C1" 
                    tick={{ fill: '#B0B8C1', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#151A24', 
                      borderColor: '#2D3748',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => {
                      // Fixed tooltip formatter to correctly display Completed and Pending
                      if (name === 'completed' || name === 'Completed') {
                        return [`${value} tasks`, 'Completed'];
                      } else if (name === 'pending' || name === 'Pending') {
                        return [`${value} tasks`, 'Pending'];
                      }
                      return [`${value}`, `${name}`];
                    }}
                    labelFormatter={(label) => `Week: ${label}`}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Bar dataKey="completed" stackId="a" name="Completed" fill="#22C55E" />
                  <Bar dataKey="pending" stackId="a" name="Pending" fill="#B0B8C1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SwipeableChartContainer>
          {/* Placing our custom legend outside the chart to have full control over styling */}
          <CustomLegend 
            payload={[
              { value: 'Completed', color: '#22C55E' },
              { value: 'Pending', color: '#B0B8C1' }
            ]} 
          />
        </ChartCard>
      </ChartsRow>

      <InsightsRow>
        <InsightsCard>
          <InsightsHeader>
            <InsightsTitle>Upcoming Reminders</InsightsTitle>
            <AddButton>+ Add reminder</AddButton>
          </InsightsHeader>
          <InsightsList>
            {upcomingReminders.map((reminder) => (
              <InsightsItem key={reminder.id}>
                <ReminderItem>
                  <ReminderContent>
                    <ReminderTitle>{reminder.title}</ReminderTitle>
                    <ReminderTime status={reminder.status}>
                      {reminder.time}
                    </ReminderTime>
                  </ReminderContent>
                </ReminderItem>
              </InsightsItem>
            ))}
          </InsightsList>
        </InsightsCard>
        
        <InsightsCard>
          <InsightsHeader>
            <InsightsTitle>Follow-ups Needed</InsightsTitle>
          </InsightsHeader>
          <InsightsList>
            {followUpsNeeded.map((followUp) => (
              <InsightsItem key={followUp.id}>
                <FollowUpItem>
                  <FollowUpContent>
                    <FollowUpCompany>{followUp.company}</FollowUpCompany>
                    <FollowUpDate>{followUp.lastContact}</FollowUpDate>
                  </FollowUpContent>
                  <ContactButton>Contact now</ContactButton>
                </FollowUpItem>
              </InsightsItem>
            ))}
          </InsightsList>
        </InsightsCard>
        
        <InsightsCard>
          <InsightsHeader>
            <InsightsTitle>Recent Activity</InsightsTitle>
          </InsightsHeader>
          <InsightsList>
            {recentActivity.map((activity) => (
              <InsightsItem key={activity.id}>
                <ActivityItem>
                  <ActivityIcon>
                    <ActivityIconWrapper type={activity.type || 'document'}>
                      {getActivityIcon(activity.type || 'document')}
                    </ActivityIconWrapper>
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityAction>{activity.action}</ActivityAction>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              </InsightsItem>
            ))}
          </InsightsList>
          <FilterContainer>
            <FilterButton active>Last 7 days</FilterButton>
            <FilterButton>Last 30 days</FilterButton>
          </FilterContainer>
        </InsightsCard>
      </InsightsRow>
    </DashboardContainer>
  );
};

export default Dashboard;