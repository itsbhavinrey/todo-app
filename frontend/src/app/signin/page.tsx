'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/auth-store';

export default function SignInPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const { login, isLoading, isAuthenticated } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/todos');
		}
	}, [isAuthenticated, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			await login(email, password);
			router.push('/todos');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Login failed. Please try again.');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
					<div className='text-center mb-6'>
						<h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Welcome Back</h1>
						<p className='text-gray-600 dark:text-gray-400'>Sign in to your account</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								Email
							</label>
							<input
								type='email'
								id='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='Enter your email'
							/>
						</div>

						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								Password
							</label>
							<input
								type='password'
								id='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='Enter your password'
							/>
						</div>

						{error && (
							<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
								<p className='text-red-800 dark:text-red-200 text-sm'>{error}</p>
							</div>
						)}

						<button
							type='submit'
							disabled={isLoading}
							className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'
						>
							{isLoading ? 'Signing In...' : 'Sign In'}
						</button>
					</form>

					<div className='mt-6 text-center'>
						<p className='text-gray-600 dark:text-gray-400'>
							Don't have an account?{' '}
							<Link href='/signup' className='text-blue-600 hover:text-blue-700 font-medium'>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
