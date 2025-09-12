import type { FC } from 'react';
import styled from 'styled-components';

export type ChallengeCardProps = {
	title: string;
	participants: number;
	imageUrl: string;
	onViewDetails?: () => void;
};

const Card = styled.article`
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
	overflow: hidden;
	display: grid;
	grid-template-rows: auto 1fr auto;
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	:focus-within,
	:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
	}
`;

const Image = styled.img`
	display: block;
	width: 100%;
	height: 160px;
	object-fit: cover;
`; 

const Body = styled.div`
	padding: 1rem;
	display: grid;
	gap: 0.25rem;
`;

const Title = styled.h3`
	margin: 0;
	font-size: 1.125rem;
	line-height: 1.3;
	color: #111827;
`;

const Meta = styled.p`
	margin: 0;
	font-size: 0.9rem;
	color: #6b7280;
`;

const Footer = styled.div`
	padding: 0.75rem 1rem 1rem 1rem;
`;

const Button = styled.button`
	appearance: none;
	border: 0;
	background: #111827;
	color: white;
	padding: 0.6rem 0.9rem;
	border-radius: 10px;
	cursor: pointer;
	font-size: 0.95rem;
	transition: background-color 0.2s ease, transform 0.02s ease;
	:focus-visible {
		outline: 2px solid #4338ca;
		outline-offset: 2px;
	}
	:hover {
		background: #0b1220;
	}
	:active {
		transform: translateY(1px);
	}
`;

export const ChallengeCard: FC<ChallengeCardProps> = ({ title, participants, imageUrl, onViewDetails }) => {
	return (
		<Card>
			<Image src={imageUrl} alt="" role="presentation" />
			<Body>
				<Title>{title}</Title>
				<Meta aria-label={`Participants: ${participants}`}>{participants.toLocaleString()} participants</Meta>
			</Body>
			<Footer>
				<Button type="button" onClick={onViewDetails} aria-label={`View details for ${title}`}>
					View Details
				</Button>
			</Footer>
		</Card>
	);
};

export default ChallengeCard; 