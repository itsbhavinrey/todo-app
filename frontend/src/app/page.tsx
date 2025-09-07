'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../store/auth-store';

export default function HomePage() {
	const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
					<p className='text-gray-600 dark:text-gray-400'>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
			<div className='text-center'>
				<h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>Welcome to Todo App</h1>

				{isAuthenticated && user ? (
					<div className='space-y-6'>
						<p className='text-xl text-gray-600 dark:text-gray-400'>Hi {user.username}!</p>
						<Link href='/todos' className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200'>
							Go to Todos
						</Link>
					</div>
				) : (
					<div className='space-y-4'>
						<p className='text-gray-600 dark:text-gray-400'>Please sign in to continue</p>
						<div className='flex space-x-4 justify-center'>
							<Link href='/signin' className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'>
								Sign In
							</Link>
							<Link href='/signup' className='bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'>
								Sign Up
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
