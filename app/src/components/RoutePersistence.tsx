import type { FC } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'last:path';

const RoutePersistence: FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const initialized = useRef(false);

	// Save on any route change
	useEffect(() => {
		const path = `${location.pathname}${location.search}${location.hash}`;
		try {
			localStorage.setItem(STORAGE_KEY, path);
		} catch {
			// ignore storage errors (e.g., Safari private mode)
		}
	}, [location]);

	// Restore once on first load if we land on '/'
	useEffect(() => {
		if (initialized.current) return;
		initialized.current = true;
		try {
			const last = localStorage.getItem(STORAGE_KEY);
			if (location.pathname === '/' && last && last !== '/') {
				navigate(last, { replace: true });
			}
		} catch {
			// ignore storage errors
		}
	}, [location.pathname, navigate]);

	return <Outlet />;
};

export default RoutePersistence; 