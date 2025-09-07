'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../store/auth-store';

export default function SignUpPage() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const { register, isLoading, isAuthenticated } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push('/todos');
		}
	}, [isAuthenticated, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 6) {
			setError('Password must be at least 6 characters long');
			return;
		}

		try {
			await register(username, email, password);
			router.push('/todos');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Registration failed. Please try again.');
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
					<div className='text-center mb-6'>
						<h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>Create Account</h1>
						<p className='text-gray-600 dark:text-gray-400'>Sign up to get started</p>
					</div>

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label htmlFor='username' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								Username
							</label>
							<input
								type='text'
								id='username'
								value={username}
								onChange={e => setUsername(e.target.value)}
								required
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='Choose a username'
							/>
						</div>

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
								placeholder='Create a password'
							/>
						</div>

						<div>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								Confirm Password
							</label>
							<input
								type='password'
								id='confirmPassword'
								value={confirmPassword}
								onChange={e => setConfirmPassword(e.target.value)}
								required
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='Confirm your password'
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
							className='w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'
						>
							{isLoading ? 'Creating Account...' : 'Create Account'}
						</button>
					</form>

					<div className='mt-6 text-center'>
						<p className='text-gray-600 dark:text-gray-400'>
							Already have an account?{' '}
							<Link href='/signin' className='text-blue-600 hover:text-blue-700 font-medium'>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
