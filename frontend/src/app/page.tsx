'use client';

import { useState, useEffect } from 'react';

export default function Home() {
	const [welcomeMessage, setWelcomeMessage] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const fetchWelcomeMessage = async () => {
		setLoading(true);
		setError('');
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/welcome`);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.text();
			setWelcomeMessage(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWelcomeMessage();
	}, []);

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
			<div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>Todo App</h1>

					<div className='mb-6'>
						<h2 className='text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4'>Backend API Test</h2>

						<button
							onClick={fetchWelcomeMessage}
							disabled={loading}
							className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'
						>
							{loading ? 'Loading...' : 'Test Welcome API'}
						</button>
					</div>

					{welcomeMessage && (
						<div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4'>
							<p className='text-green-800 dark:text-green-200 font-medium'>✅ API Response:</p>
							<p className='text-green-700 dark:text-green-300 mt-1'>{welcomeMessage}</p>
						</div>
					)}

					{error && (
						<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4'>
							<p className='text-red-800 dark:text-red-200 font-medium'>❌ Error:</p>
							<p className='text-red-700 dark:text-red-300 mt-1'>{error}</p>
						</div>
					)}

					<div className='text-sm text-gray-500 dark:text-gray-400 mt-4'>
						<p>Frontend: Next.js (localhost:3000)</p>
						<p>Backend: NestJS ({process.env.NEXT_PUBLIC_API_URL}/welcome)</p>
					</div>
				</div>
			</div>
		</div>
	);
}
