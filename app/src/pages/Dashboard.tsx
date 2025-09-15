import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

// Types
interface JobApplication {
  id: string;
  company_name: string;
  position: string;
  status: 'draft' | 'applied' | 'interview' | 'offer' | 'rejected';
  applied_date?: string;
  created_at: string;
}

const Page = styled.main`
	min-height: 100vh;
	background: linear-gradient(180deg, #0b1220 0%, #0f172a 100%);
	color: #ffffff;
	display: flex;
	flex-direction: column;
`;

const Container = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 2rem 1rem 3rem 1rem;
`;

const Heading = styled.h1`
	margin: 0 0 1.5rem 0;
	font-size: 1.8rem;
	font-weight: 700;
`;

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;
`;

const StatCard = styled.div`
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	padding: 1.5rem;
	text-align: center;
`;

const StatNumber = styled.div`
	font-size: 2rem;
	font-weight: 700;
	margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
	color: #cbd5e1;
	font-size: 0.9rem;
`;

const KanbanBoard = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
`;

const KanbanColumn = styled.div`
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	padding: 1rem;
`;

const ColumnHeader = styled.h2`
	margin: 0 0 1rem 0;
	font-size: 1.2rem;
	font-weight: 600;
	color: #c7d2fe;
`;

const ApplicationCard = styled.div`
	background: rgba(15, 23, 42, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 12px;
	padding: 1rem;
	margin-bottom: 1rem;
`;

const ApplicationCompany = styled.h3`
	margin: 0 0 0.25rem 0;
	font-size: 1rem;
	font-weight: 600;
`;

const ApplicationPosition = styled.div`
	color: #94a3b8;
	font-size: 0.9rem;
	margin-bottom: 0.5rem;
`;

const ApplicationDate = styled.div`
	color: #64748b;
	font-size: 0.8rem;
`;

const StatusBadge = styled.span<{ status: string }>`
	display: inline-block;
	padding: 0.25rem 0.5rem;
	border-radius: 20px;
	font-size: 0.75rem;
	font-weight: 600;
	
	${props => {
		switch (props.status) {
			case 'draft':
				return `
					background: rgba(156, 163, 175, 0.2);
					color: #9ca3af;
				`;
			case 'applied':
				return `
					background: rgba(59, 130, 246, 0.2);
					color: #3b82f6;
				`;
			case 'interview':
				return `
					background: rgba(168, 85, 247, 0.2);
					color: #a855f7;
				`;
			case 'offer':
				return `
					background: rgba(16, 185, 129, 0.2);
					color: #10b981;
				`;
			case 'rejected':
				return `
					background: rgba(239, 68, 68, 0.2);
					color: #ef4444;
				`;
			default:
				return `
					background: rgba(156, 163, 175, 0.2);
					color: #9ca3af;
				`;
		}
	}}
`;

const LoadingMessage = styled.div`
	text-align: center;
	padding: 2rem;
	color: #94a3b8;
`;

const ErrorMessage = styled.div`
	background: rgba(220, 38, 38, 0.15);
	border: 1px solid rgba(220, 38, 38, 0.3);
	border-radius: 10px;
	padding: 1rem;
	color: #fecaca;
	text-align: center;
	margin-bottom: 1rem;
`;

export const Dashboard: FC = () => {
	const { user } = useAuth();
	const [applications, setApplications] = useState<JobApplication[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchApplications = async () => {
			if (!user) return;
			
			try {
				setLoading(true);
				const { data, error } = await supabase
					.from('job_applications')
					.select('id, company_name, position, status, applied_date, created_at')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false });

				if (error) throw error;
				
				setApplications(data || []);
			} catch (err) {
				console.error('Error fetching applications:', err);
				setError('Failed to load job applications');
			} finally {
				setLoading(false);
			}
		};

		fetchApplications();
	}, [user]);

	// Group applications by status
	const groupedApplications = applications.reduce((acc, app) => {
		if (!acc[app.status]) {
			acc[app.status] = [];
		}
		acc[app.status].push(app);
		return acc;
	}, {} as Record<string, JobApplication[]>);

	// Calculate stats
	const stats = {
		total: applications.length,
		applied: applications.filter(app => app.status === 'applied').length,
		interview: applications.filter(app => app.status === 'interview').length,
		offer: applications.filter(app => app.status === 'offer').length,
	};

	if (loading) {
		return (
			<Page>
				<Navbar />
				<Container>
					<Heading>Dashboard</Heading>
					<LoadingMessage>Loading your job applications...</LoadingMessage>
				</Container>
				<Footer />
			</Page>
		);
	}

	return (
		<Page>
			<Navbar />
			<Container>
				<Heading>Dashboard</Heading>
				
				{error && <ErrorMessage>{error}</ErrorMessage>}
				
				<StatsGrid>
					<StatCard>
						<StatNumber>{stats.total}</StatNumber>
						<StatLabel>Total Applications</StatLabel>
					</StatCard>
					<StatCard>
						<StatNumber>{stats.applied}</StatNumber>
						<StatLabel>Applied</StatLabel>
					</StatCard>
					<StatCard>
						<StatNumber>{stats.interview}</StatNumber>
						<StatLabel>Interviews</StatLabel>
					</StatCard>
					<StatCard>
						<StatNumber>{stats.offer}</StatNumber>
						<StatLabel>Offers</StatLabel>
					</StatCard>
				</StatsGrid>
				
				<KanbanBoard>
					<KanbanColumn>
						<ColumnHeader>Draft</ColumnHeader>
						{groupedApplications.draft?.map(app => (
							<ApplicationCard key={app.id}>
								<ApplicationCompany>{app.company_name}</ApplicationCompany>
								<ApplicationPosition>{app.position}</ApplicationPosition>
								<StatusBadge status={app.status}>
									{app.status.charAt(0).toUpperCase() + app.status.slice(1)}
								</StatusBadge>
								<ApplicationDate>
									Created: {new Date(app.created_at).toLocaleDateString()}
								</ApplicationDate>
							</ApplicationCard>
						))}
					</KanbanColumn>
					
					<KanbanColumn>
						<ColumnHeader>Applied</ColumnHeader>
						{groupedApplications.applied?.map(app => (
							<ApplicationCard key={app.id}>
								<ApplicationCompany>{app.company_name}</ApplicationCompany>
								<ApplicationPosition>{app.position}</ApplicationPosition>
								<StatusBadge status={app.status}>
									{app.status.charAt(0).toUpperCase() + app.status.slice(1)}
								</StatusBadge>
								{app.applied_date && (
									<ApplicationDate>
										Applied: {new Date(app.applied_date).toLocaleDateString()}
									</ApplicationDate>
								)}
							</ApplicationCard>
						))}
					</KanbanColumn>
					
					<KanbanColumn>
						<ColumnHeader>Interview</ColumnHeader>
						{groupedApplications.interview?.map(app => (
							<ApplicationCard key={app.id}>
								<ApplicationCompany>{app.company_name}</ApplicationCompany>
								<ApplicationPosition>{app.position}</ApplicationPosition>
								<StatusBadge status={app.status}>
									{app.status.charAt(0).toUpperCase() + app.status.slice(1)}
								</StatusBadge>
							</ApplicationCard>
						))}
					</KanbanColumn>
					
					<KanbanColumn>
						<ColumnHeader>Offer</ColumnHeader>
						{groupedApplications.offer?.map(app => (
							<ApplicationCard key={app.id}>
								<ApplicationCompany>{app.company_name}</ApplicationCompany>
								<ApplicationPosition>{app.position}</ApplicationPosition>
								<StatusBadge status={app.status}>
									{app.status.charAt(0).toUpperCase() + app.status.slice(1)}
								</StatusBadge>
							</ApplicationCard>
						))}
					</KanbanColumn>
					
					<KanbanColumn>
						<ColumnHeader>Rejected</ColumnHeader>
						{groupedApplications.rejected?.map(app => (
							<ApplicationCard key={app.id}>
								<ApplicationCompany>{app.company_name}</ApplicationCompany>
								<ApplicationPosition>{app.position}</ApplicationPosition>
								<StatusBadge status={app.status}>
									{app.status.charAt(0).toUpperCase() + app.status.slice(1)}
								</StatusBadge>
							</ApplicationCard>
						))}
					</KanbanColumn>
				</KanbanBoard>
			</Container>
			<Footer />
		</Page>
	);
};

export default Dashboard;