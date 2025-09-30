import type { FC } from 'react';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../contexts/I18nProvider';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';
import { supabase } from '../lib/supabaseClient';

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
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
  border-radius: 20px;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
  
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
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(4px);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  
  // Add subtle glow effect
  box-shadow: 0 0 15px ${props => props.theme.gradients.primaryGlow};
  
  &:hover {
    box-shadow: 0 0 20px ${props => props.theme.gradients.primaryGlow}, 0 0 0 2px ${props => props.theme.colors.primary};
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
  color: ${props => props.theme.colors.primary};
  
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
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
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
  background-color: ${props => props.theme.glass.card};
  backdrop-filter: saturate(120%) blur(6px);
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

const FilterContainer = styled.div`  display: flex;
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
    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 15L10 10L13 13L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

// Styled component for legend text — theme-aware for readability on light backgrounds
const LegendText = styled.span`
  color: ${props => props.theme.colors.headings} !important;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  text-shadow: none;
  
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

// Simple modal styles for creating reminders
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalCard = styled.div`
  background: ${p => p.theme.glass.card};
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 12px;
  padding: 1rem;
  width: 90%;
  max-width: 420px;
`;

const ModalTitle = styled.h3`
  color: ${p => p.theme.colors.headings};
  margin: 0 0 0.75rem 0;
`;

const ModalRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const ModalInput = styled.input`
  background: rgba(255,255,255,0.06);
  color: ${p => p.theme.colors.headings};
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 8px;
  padding: 0.5rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ModalButton = styled.button`
  background: ${p => p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
`;

const ModalCancel = styled.button`
  background: rgba(255,255,255,0.06);
  color: ${p => p.theme.colors.headings};
  border: 1px solid ${p => p.theme.colors.borders};
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  cursor: pointer;
`;

export const Dashboard: FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  // Read authenticated user to personalize greeting
  const { user } = useAuth();
  const [showNotification, setShowNotification] = useState(true);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [remTitle, setRemTitle] = useState('');
  const [remWhen, setRemWhen] = useState(''); // datetime-local
  const [savingReminder, setSavingReminder] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  
  // Supabase-backed dashboard state
  const [kpiData, setKpiData] = useState({
    applicationsSubmitted: { value: 0, change: '', changePositive: true },
    interviewsScheduled: { value: 0, change: '', changePositive: true },
    documentsUploaded: { value: 0, change: '', changePositive: true },
    successRate: { value: 0, change: '', changePositive: true },
  });
  const [applicationsOverTimeData, setApplicationsOverTimeData] = useState<Array<{ week: string; applications: number }>>([]);
  const [tasksCompletedData, setTasksCompletedData] = useState<Array<{ week: string; completed: number; pending: number }>>([]);
  const [upcomingReminders, setUpcomingReminders] = useState<Array<{ id: string; title: string; time: string; status: 'upcoming' | 'soon' | 'overdue' }>>([]);
  const [followUpsNeeded, setFollowUpsNeeded] = useState<Array<{ id: string; company: string; lastContact: string }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ id: string; type: string; action: string; time: string }>>([]);
  const [nextInterviewDate, setNextInterviewDate] = useState<string | null>(null);
  const [hasOfferToday, setHasOfferToday] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;

    const formatDate = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const getWeekStart = (d: Date) => {
      const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const day = date.getUTCDay(); // 0 Sun - 6 Sat
      const diff = (day === 0 ? -6 : 1) - day; // move to Monday
      const monday = new Date(date);
      monday.setUTCDate(date.getUTCDate() + diff);
      return formatDate(monday); // label by Monday date
    };

    const load = async () => {
      // 1) KPIs (with status fallbacks)
      const [appsCountRes, interviewsCountRes, docsCountRes, offersCountRes] = await Promise.all([
        supabase
          .from('job_applications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('job_applications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .or('status.eq.Interview,interview_date.not.is.null'),
        supabase
          .from('documents')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('job_applications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .or('status.eq.Offer,offer_date.not.is.null'),
      ]);

      const totalApps = appsCountRes.count || 0;
      const interviews = interviewsCountRes.count || 0;
      const documents = docsCountRes.count || 0;
      const offers = offersCountRes.count || 0;
      const successRate = totalApps > 0 ? Math.round((offers / totalApps) * 100) : 0;

      setKpiData({
        applicationsSubmitted: { value: totalApps, change: '', changePositive: true },
        interviewsScheduled: { value: interviews, change: '', changePositive: true },
        documentsUploaded: { value: documents, change: '', changePositive: true },
        successRate: { value: successRate, change: '', changePositive: true },
      });

      // Next interview date (nearest future; include those scheduled today)
      const now = new Date();
      const todayStr = formatDate(now);
      const { data: appsForInterview } = await supabase
        .from('job_applications')
        .select('interview_date, status')
        .eq('user_id', user.id);
      let next: string | null = null;
      (appsForInterview || []).forEach(r => {
        if (r.interview_date) {
          const dt = new Date(r.interview_date);
          if (dt >= now) {
            if (!next || dt < new Date(next)) next = dt.toISOString();
          }
        }
      });
      // Fallback: status Interview without date => treat as today
      if (!next && (appsForInterview || []).some(r => r.status === 'Interview')) {
        next = now.toISOString();
      }
      setNextInterviewDate(next);

      // Offer today (either offer_date = today or status Offer updated today)
      const { data: offersToday } = await supabase
        .from('job_applications')
        .select('offer_date, status, updated_at')
        .eq('user_id', user.id)
        .or('offer_date.eq.' + todayStr + ',status.eq.Offer');
      const hasToday = (offersToday || []).some(r => (r.offer_date && r.offer_date === todayStr) || r.status === 'Offer');
      setHasOfferToday(hasToday);

      // 2) Applications over time (last 8 weeks by applied_date)
      const eightWeeksAgo = new Date();
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 7 * 8);
      const { data: appsDates } = await supabase
        .from('job_applications')
        .select('applied_date')
        .eq('user_id', user.id)
        .gte('applied_date', formatDate(eightWeeksAgo));

      const byWeek: Record<string, number> = {};
      for (let i = 7; i >= 0; i--) {
        const dt = new Date();
        dt.setDate(dt.getDate() - i * 7);
        const wk = getWeekStart(dt);
        byWeek[wk] = 0;
      }
      (appsDates || []).forEach(r => {
        if (!r.applied_date) return;
        const wk = getWeekStart(new Date(r.applied_date));
        if (byWeek[wk] !== undefined) byWeek[wk] += 1;
      });
      const appsOver = Object.entries(byWeek).map(([week, applications]) => ({ week, applications }));
      setApplicationsOverTimeData(appsOver);

      // 3) Tasks completed vs pending (last 8 weeks)
      const { data: tasks } = await supabase
        .from('activities')
        .select('completed, created_at')
        .eq('user_id', user.id)
        .gte('created_at', eightWeeksAgo.toISOString());

      const weekAgg: Record<string, { completed: number; pending: number }> = {};
      for (let i = 7; i >= 0; i--) {
        const dt = new Date();
        dt.setDate(dt.getDate() - i * 7);
        const wk = getWeekStart(dt);
        weekAgg[wk] = { completed: 0, pending: 0 };
      }
      (tasks || []).forEach(t => {
        const d = new Date(t.created_at);
        const wk = getWeekStart(d);
        if (weekAgg[wk]) {
          if (t.completed) weekAgg[wk].completed += 1; else weekAgg[wk].pending += 1;
        }
      });
      setTasksCompletedData(Object.entries(weekAgg).map(([week, v]) => ({ week, completed: v.completed, pending: v.pending })));

      // 4) Upcoming reminders and follow-ups and recent activity remain as is
      const todayStr2 = formatDate(new Date());
      const { data: upcomingActs } = await supabase
        .from('activities')
        .select('id, title, due_date')
        .eq('user_id', user.id)
        .eq('completed', false)
        .gte('due_date', todayStr2)
        .order('due_date', { ascending: true })
        .limit(5);

      setUpcomingReminders(
        (upcomingActs || []).map(r => ({
          id: r.id,
          title: r.title,
          time: r.due_date ? new Date(r.due_date).toLocaleDateString() : 'Soon',
          status: 'upcoming',
        }))
      );

      // 5) Follow-ups Needed (overdue incomplete, enrich with company)
      const { data: overdue } = await supabase
        .from('activities')
        .select('id, job_application_id, due_date')
        .eq('user_id', user.id)
        .eq('completed', false)
        .lt('due_date', todayStr2)
        .order('due_date', { ascending: true })
        .limit(5);

      let followUpOut: Array<{ id: string; company: string; lastContact: string }> = [];
      if (overdue && overdue.length > 0) {
        const appIds = Array.from(new Set(overdue.map(o => o.job_application_id).filter(Boolean)));
        const appMap = new Map<string, string>();
        if (appIds.length > 0) {
          const { data: apps } = await supabase
            .from('job_applications')
            .select('id, company_name')
            .eq('user_id', user.id)
            .in('id', appIds as string[]);
          if (apps) {
            for (const a of apps) appMap.set(a.id, a.company_name);
          }
        }
        followUpOut = overdue.map(o => ({
          id: o.id,
          company: (o.job_application_id && appMap.get(o.job_application_id)) || 'Application',
          lastContact: o.due_date ? new Date(o.due_date).toLocaleDateString() : '-',
        }));
      }
      setFollowUpsNeeded(followUpOut);

      // 6) Recent Activity (mix documents and activities by created_at)
      const [recentActsRes, recentDocsRes] = await Promise.all([
        supabase.from('activities').select('id, created_at, type, title').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('documents').select('id, created_at, name').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ]);

      type Entry = { id: string; created_at: string; type: string; action: string };
      const actEntries: Entry[] = (recentActsRes.data || []).map(a => ({ id: a.id, created_at: a.created_at, type: a.type || 'application', action: a.title }));
      const docEntries: Entry[] = (recentDocsRes.data || []).map(d => ({ id: d.id, created_at: d.created_at, type: 'document', action: `Uploaded ${d.name}` }));
      const merged = [...actEntries, ...docEntries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
      setRecentActivity(merged.map(m => ({ id: m.id, type: m.type, action: m.action, time: new Date(m.created_at).toLocaleString() })));
    };

    load();

    // Realtime refresh for KPI updates when job_applications change
    const channel = supabase
      .channel(`dashboard-apps-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_applications', filter: `user_id=eq.${user.id}` }, () => {
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Derive display name from user metadata or email
  const getDisplayName = (): string => {
    const meta = (user?.user_metadata as Record<string, unknown>) || {};
    const first = typeof meta.first_name === 'string' ? meta.first_name : undefined;
    const last = typeof meta.last_name === 'string' ? meta.last_name : undefined;
    if (first) return first;
    if (last) return last;
    if (user?.email) return user.email.split('@')[0];
    return 'there';
  };

  // Function to get personalized welcome message based on day and interview status
  const getWelcomeMessage = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (nextInterviewDate) {
      return t('dashboard.welcome.interviewUpcoming');
    }
    switch (dayOfWeek) {
      case 1: return t('dashboard.welcome.planWeek');
      case 5: return t('dashboard.welcome.weekendReminders');
      default: return t('dashboard.welcome.overview');
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

  const openAddReminder = () => {
    setRemTitle('');
    setRemWhen('');
    setReminderOpen(true);
    setTimeout(() => titleRef.current?.focus(), 0);
  };

  const saveReminder = async () => {
    if (!user) return;
    if (!remTitle) return;
    setSavingReminder(true);
    try {
      const payload: Record<string, unknown> = {
        title: remTitle,
        type: 'reminder',
        due_date: remWhen || null,
        user_id: user.id,
        completed: false,
      };
      const { error } = await supabase.from('activities').insert(payload);
      if (error) throw error;
      setReminderOpen(false);
      // give backend a tick; dashboard will refresh on next load/realtime
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      // noop display for brevity; could add error toast
    } finally {
      setSavingReminder(false);
    }
  };

  return (
    <DashboardContainer>
      {/* Notification banner shown only if there is at least one upcoming interview or an offer today */}
      {(nextInterviewDate || hasOfferToday) && showNotification && (
        <NotificationBanner>
          <NotificationContent>
            <NotificationIcon>🔔</NotificationIcon>
            <NotificationText>
              {hasOfferToday ? t('dashboard.notification.offerReceived') : t('dashboard.notification.interviewsUpcoming')}
            </NotificationText>
          </NotificationContent>
          <NotificationClose onClick={() => setShowNotification(false)}>×</NotificationClose>
        </NotificationBanner>
      )}

      <WelcomeCard>
        <WelcomeHeader>
          <div>
            <WelcomeTitle>{t('dashboard.welcome.title').replace('{name}', getDisplayName())}</WelcomeTitle>
            <WelcomeSubtitle>{getWelcomeMessage()}</WelcomeSubtitle>
          </div>
          <div>
            {nextInterviewDate && (
              <>
                <NextInterviewPill>{t('dashboard.nextInterview').replace('{date}', new Date(nextInterviewDate).toLocaleDateString())}</NextInterviewPill>
                <InterviewDetailsLink href="#" onClick={(e) => { e.preventDefault(); alert('Opening interview details in calendar...'); }}>
                  {t('dashboard.viewDetails')}
                </InterviewDetailsLink>
              </>
            )}
          </div>
        </WelcomeHeader>
      </WelcomeCard>

      <KpiGrid>
        <KpiCard onClick={() => handleKpiClick('/applications')}>
          <KpiHeader>
            <BriefcaseIcon />
          </KpiHeader>
          <KpiValue>{kpiData.applicationsSubmitted.value}</KpiValue>
          <KpiLabel>{t('dashboard.kpi.applications')}</KpiLabel>
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
          <KpiLabel>{t('dashboard.kpi.interviews')}</KpiLabel>
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
          <KpiLabel>{t('dashboard.kpi.documents')}</KpiLabel>
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
          <KpiLabel>{t('dashboard.kpi.success')}</KpiLabel>
          <KpiChange positive={kpiData.successRate.changePositive}>
            {kpiData.successRate.change}
            <TrendIcon>{kpiData.successRate.changePositive ? '↗' : '↘'}</TrendIcon>
          </KpiChange>
        </KpiCard>
      </KpiGrid>

      <ChartsRow>
        <ChartCard>
          <ChartTitle>{t('dashboard.charts.applications')}</ChartTitle>
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
                    formatter={(value) => [`${value} ${t('dashboard.kpi.applications').toLowerCase()}`, t('dashboard.kpi.applications')]}
                    labelFormatter={(label) => `Uke: ${label}`}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <ReferenceLine 
                    y={10} 
                    stroke="#EF4444" 
                    strokeDasharray="3 3"
                  >
                    <Label 
                      value="Mål: 10/uke" 
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
                    name={t('dashboard.kpi.applications')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SwipeableChartContainer>
          <CustomLegend payload={[{ value: t('dashboard.kpi.applications'), color: '#3B82F6' }]} />
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>{t('dashboard.charts.tasks')}</ChartTitle>
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
                      if (name === 'completed' || name === 'Completed') {
                        return [`${value} oppgaver`, t('tasks.completed')];
                      } else if (name === 'pending' || name === 'Pending') {
                        return [`${value} oppgaver`, t('tasks.pending')];
                      }
                      return [`${value}`, `${name}`];
                    }}
                    labelFormatter={(label) => `Uke: ${label}`}
                    itemStyle={{ color: '#FFFFFF' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Bar dataKey="completed" stackId="a" name={t('tasks.completed')} fill="#22C55E" />
                  <Bar dataKey="pending" stackId="a" name={t('tasks.pending')} fill="#B0B8C1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SwipeableChartContainer>
          <CustomLegend payload={[{ value: t('tasks.completed'), color: '#22C55E' }, { value: t('tasks.pending'), color: '#B0B8C1' }]} />
        </ChartCard>
      </ChartsRow>

      <InsightsRow>
        <InsightsCard>
          <InsightsHeader>
            <InsightsTitle>{t('dashboard.reminders.upcoming')}</InsightsTitle>
            <AddButton onClick={openAddReminder}>{t('dashboard.reminder.add')}</AddButton>
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
            <InsightsTitle>{t('dashboard.reminders.followup')}</InsightsTitle>
          </InsightsHeader>
          <InsightsList>
            {followUpsNeeded.map((followUp) => (
              <InsightsItem key={followUp.id}>
                <FollowUpItem>
                  <FollowUpContent>
                    <FollowUpCompany>{followUp.company}</FollowUpCompany>
                    <FollowUpDate>{followUp.lastContact}</FollowUpDate>
                  </FollowUpContent>
                  <ContactButton>Kontakt nå</ContactButton>
                </FollowUpItem>
              </InsightsItem>
            ))}
          </InsightsList>
        </InsightsCard>
        
        <InsightsCard>
          <InsightsHeader>
            <InsightsTitle>{t('dashboard.reminders.recent')}</InsightsTitle>
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
            <FilterButton active>Siste 7 dager</FilterButton>
            <FilterButton>Siste 30 dager</FilterButton>
          </FilterContainer>
        </InsightsCard>
      </InsightsRow>
      {reminderOpen && (
        <ModalBackdrop onClick={() => setReminderOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{t('dashboard.reminder.add')}</ModalTitle>
            <ModalRow>
              <label htmlFor="rem-title" style={{ color: 'inherit', fontSize: '0.9rem' }}>{t('dashboard.reminder.title')}</label>
              <ModalInput id="rem-title" ref={titleRef} value={remTitle} onChange={(e) => setRemTitle(e.target.value)} placeholder="Følg opp med bedrift" />
            </ModalRow>
            <ModalRow>
              <label htmlFor="rem-when" style={{ color: 'inherit', fontSize: '0.9rem' }}>{t('dashboard.reminder.when')}</label>
              <ModalInput id="rem-when" type="datetime-local" value={remWhen} onChange={(e) => setRemWhen(e.target.value)} />
            </ModalRow>
            <ModalActions>
              <ModalCancel type="button" onClick={() => setReminderOpen(false)}>{t('dashboard.reminder.cancel')}</ModalCancel>
              <ModalButton type="button" onClick={saveReminder} disabled={savingReminder}>{savingReminder ? t('profile.saving') : t('dashboard.reminder.save')}</ModalButton>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
