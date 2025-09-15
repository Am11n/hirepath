import type { FC } from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

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

const Card = styled.div`
	background: rgba(255, 255, 255, 0.06);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 16px;
	padding: 2rem;
	margin-bottom: 2rem;
`;

const FormGroup = styled.div`
	display: grid;
	gap: 0.5rem;
	margin-bottom: 1rem;
`;

const Label = styled.label`
	font-size: 0.95rem;
	font-weight: 500;
	color: #e5e7eb;
`;

const Input = styled.input`
	background: rgba(15, 23, 42, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 10px;
	padding: 0.75rem 1rem;
	color: #ffffff;
	font-size: 1rem;
	width: 100%;
	:focus {
		outline: 2px solid #818cf8;
		outline-offset: 2px;
		border-color: #818cf8;
	}
`;

const Button = styled.button`
	background: #4338ca;
	color: white;
	border: none;
	border-radius: 10px;
	padding: 0.75rem 1rem;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s ease;
	:focus-visible {
		outline: 2px solid #a5b4fc;
		outline-offset: 2px;
	}
	:hover {
		background: #3730a3;
	}
`;

const UserInfo = styled.div`
	display: grid;
	gap: 0.5rem;
`;

const UserEmail = styled.p`
	color: #cbd5e1;
	font-size: 1rem;
`;

const ErrorMessage = styled.div`
	background: rgba(220, 38, 38, 0.15);
	border: 1px solid rgba(220, 38, 38, 0.3);
	border-radius: 10px;
	padding: 0.75rem;
	color: #fecaca;
	font-size: 0.9rem;
	margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
	background: rgba(16, 185, 129, 0.15);
	border: 1px solid rgba(16, 185, 129, 0.3);
	border-radius: 10px;
	padding: 0.75rem;
	color: #6ee7b7;
	font-size: 0.9rem;
	margin-bottom: 1rem;
`;

export const Profile: FC = () => {
	const { user, signOut } = useAuth();
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [fullName, setFullName] = useState('');
	const [company, setCompany] = useState('');

	useEffect(() => {
		const fetchProfile = async () => {
			if (user) {
				try {
					const { data, error } = await supabase
						.from('profiles')
						.select('full_name, company')
						.eq('id', user.id)
						.single();

					if (error && error.code !== 'PGRST116') {
						throw error;
					}

					if (data) {
						setFullName(data.full_name || '');
						setCompany(data.company || '');
					}
				} catch (err) {
					console.error('Error fetching profile:', err);
					setError('Failed to load profile data');
				} finally {
					setLoading(false);
				}
			}
		};

		fetchProfile();
	}, [user]);

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setUpdating(true);
		setError('');
		setSuccess('');

		try {
			const { error } = await supabase
				.from('profiles')
				.upsert({
					id: user?.id,
					full_name: fullName,
					company: company,
					updated_at: new Date(),
				});

			if (error) throw error;

			setSuccess('Profile updated successfully!');
		} catch (err) {
			console.error('Error updating profile:', err);
			setError('Failed to update profile');
		} finally {
			setUpdating(false);
		}
	};

	const handleSignOut = async () => {
		try {
			await signOut();
		} catch (err) {
			console.error('Error signing out:', err);
			setError('Failed to sign out');
		}
	};

	if (loading) {
		return (
			<Page>
				<Navbar />
				<Container>
					<Heading>Loading profile...</Heading>
				</Container>
				<Footer />
			</Page>
		);
	}

	return (
		<Page>
			<Navbar />
			<Container>
				<Heading>Profile</Heading>
				
				{error && <ErrorMessage>{error}</ErrorMessage>}
				{success && <SuccessMessage>{success}</SuccessMessage>}
				
				<Card>
					<UserInfo>
						<Label>Email</Label>
						<UserEmail>{user?.email}</UserEmail>
					</UserInfo>
				</Card>
				
				<Card>
					<Heading as="h2" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
						Profile Information
					</Heading>
					<form onSubmit={handleUpdateProfile}>
						<FormGroup>
							<Label htmlFor="fullName">Full Name</Label>
							<Input
								id="fullName"
								type="text"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								placeholder="Your full name"
							/>
						</FormGroup>
						<FormGroup>
							<Label htmlFor="company">Company</Label>
							<Input
								id="company"
								type="text"
								value={company}
								onChange={(e) => setCompany(e.target.value)}
								placeholder="Your company"
							/>
						</FormGroup>
						<Button type="submit" disabled={updating}>
							{updating ? 'Updating...' : 'Update Profile'}
						</Button>
					</form>
				</Card>
				
				<Card>
					<Heading as="h2" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
						Account Settings
					</Heading>
					<Button 
						onClick={handleSignOut}
						style={{ background: '#dc2626' }}
						onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
						onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
					>
						Sign Out
					</Button>
				</Card>
			</Container>
			<Footer />
		</Page>
	);
};

export default Profile;