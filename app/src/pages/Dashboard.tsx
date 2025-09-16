import type { FC } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';
import { kpiData, applicationsOverTimeData, tasksCompletedData, upcomingReminders, followUpsNeeded, recentActivity } from '../data/mock';

// Define types for our data structures

// Styled components
const DashboardContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const WelcomeCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const WelcomeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const WelcomeTitle = styled.h1`
  color: ${props => props.theme.colors.headings};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const WelcomeSubtitle = styled.p`
  color: ${props => props.theme.colors.bodyText};
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
`;

const NextInterviewPill = styled.span`
  background: rgba(59, 130, 246, 0.2);
  color: ${props => props.theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 100%;
`;

const KpiCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}, 0 8px 24px rgba(0,0,0,.35);
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const KpiHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  width: 100%;
  min-height: 32px;
  position: relative;
`;

const KpiValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.headings};
  margin-bottom: 0.5rem;
`;

const KpiLabel = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.bodyText};
  margin-bottom: 0.5rem;
`;

const KpiChange = styled.div<{ positive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: ${props => props.positive ? props.theme.colors.success : props.theme.colors.warning};
  font-weight: 600;
`;

const TrendIcon = styled.span`
  margin-left: 0.25rem;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 100%;
`;

const ChartCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const ChartTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
`;

const InsightsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;
`;

const InsightsCard = styled.div`
  background-color: ${props => props.theme.colors.cardSurface};
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  padding: 1.5rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const InsightsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const InsightsTitle = styled.h2`
  color: ${props => props.theme.colors.headings};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const AddButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
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
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightsItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid ${props => props.theme.colors.borders};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReminderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReminderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReminderTitle = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const ReminderTime = styled.span<{ status?: string }>`
  color: ${props => {
    if (props.status === 'overdue') return props.theme.colors.error;
    if (props.status === 'due-soon') return props.theme.colors.warning;
    return props.theme.colors.bodyText;
  }};
  font-size: 0.875rem;
  font-weight: ${props => props.status ? '600' : 'normal'};
`;

const FollowUpItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FollowUpContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const FollowUpCompany = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const FollowUpDate = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;

const ActivityIcon = styled.div`
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActivityIconWrapper = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.2); /* Blue background for all icons */
  color: ${props => props.theme.colors.primary}; /* Blue color for all icons */
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityAction = styled.span`
  color: ${props => props.theme.colors.headings};
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.span`
  color: ${props => props.theme.colors.bodyText};
  font-size: 0.875rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.bodyText};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.borders};
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#2563eb' : 'rgba(255, 255, 255, 0.05)'};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

// SVG Icon Components
const BriefcaseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 2V6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3V19H21" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 15L10 10L13 13L17 7" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Activity Icon Components
const DocumentActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const InterviewActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
    <line x1="12" y1="19" x2="12" y2="15"></line>
  </svg>
);

const ApplicationActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
    <polyline points="16 11 12 15 8 11"></polyline>
  </svg>
);

const CommunicationActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Custom Bar component with percentage labels

// Styled component for legend text to ensure white color
const LegendText = styled.span`
  color: #FFFFFF !important;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  text-shadow: 0 0 1px rgba(0,0,0,0.5);
`;

// Custom Legend component with colored text
const CustomLegend = (props: { payload?: Array<{ value: string; color: string }> }) => {
  // Handle both Recharts payload and manual payload
  const payload = props.payload || [];
  
  // Return null if no payload
  if (!payload || payload.length === 0) return null;
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', marginTop: '10px' }}>
      {payload.map((entry, index) => {
        // Use the color from the entry
        const color = entry.color || '#FFFFFF';
        
        return (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
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

  return (
    <DashboardContainer>
      <WelcomeCard>
        <WelcomeHeader>
          <div>
            <WelcomeTitle>Welcome back, User</WelcomeTitle>
            <WelcomeSubtitle>Here's your job search overview.</WelcomeSubtitle>
          </div>
          <NextInterviewPill>Next interview: Tue 10:30</NextInterviewPill>
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
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={applicationsOverTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis 
                  dataKey="week" 
                  stroke="#B0B8C1" 
                  tick={{ fill: '#B0B8C1' }} 
                />
                <YAxis 
                  stroke="#B0B8C1" 
                  tick={{ fill: '#B0B8C1' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#151A24', 
                    borderColor: '#2D3748',
                    color: '#FFFFFF'
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
                    fontSize={12}
                  />
                </ReferenceLine>
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#3B82F6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
            {/* Custom legend for Applications over time chart */}
            <CustomLegend 
              payload={[
                { value: 'Applications', color: '#3B82F6' }
              ]} 
            />
          </div>
        </ChartCard>
        
        <ChartCard>
          <ChartTitle>Tasks Completed vs Pending</ChartTitle>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tasksCompletedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis 
                  dataKey="week" 
                  stroke="#B0B8C1" 
                  tick={{ fill: '#B0B8C1' }} 
                />
                <YAxis 
                  stroke="#B0B8C1" 
                  tick={{ fill: '#B0B8C1' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#151A24', 
                    borderColor: '#2D3748',
                    color: '#FFFFFF'
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
            {/* Placing our custom legend outside the chart to have full control over styling */}
            <CustomLegend 
              payload={[
                { value: 'Completed', color: '#22C55E' },
                { value: 'Pending', color: '#B0B8C1' }
              ]} 
            />
          </div>
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