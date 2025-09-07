'use client';

import React from 'react';
import Link from 'next/link';
import type { User } from '../../types';

interface HeaderProps {
	user: User | null;
	onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
	return (
		<header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
			<div className='max-w-4xl mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					<Link href='/' className='flex items-center space-x-3'>
						<div className='p-2 bg-blue-600 rounded-lg'>
							<svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
								/>
							</svg>
						</div>
						<div>
							<h1 className='text-xl font-bold text-gray-900 dark:text-white'>Todo App</h1>
							<p className='text-sm text-gray-600 dark:text-gray-400'>Stay organized and productive</p>
						</div>
					</Link>

					{user && (
						<div className='flex items-center space-x-4'>
							<div className='text-right'>
								<p className='text-sm font-medium text-gray-900 dark:text-white'>Welcome, {user.username}</p>
								<p className='text-xs text-gray-600 dark:text-gray-400'>{user.email}</p>
							</div>
							<button onClick={onLogout} className='px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors'>
								Logout
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
};
