'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth-store';
import { queryClient } from '../../lib/query-client';
import { Header } from '../../components/layout/Header';
import { AddTodoForm } from '../../components/todo/AddTodoForm';
import { TodoList } from '../../components/todo/TodoList';

function TodosContent() {
	const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/signin');
		}
	}, [isAuthenticated, isLoading, router]);

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/signin');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

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

	if (!isAuthenticated) {
		return null;
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<Header user={user} onLogout={handleLogout} />

			<main className='max-w-4xl mx-auto px-4 py-8'>
				<div className='mb-8'>
					<h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>My Todos</h2>
					<p className='text-gray-600 dark:text-gray-400'>Organize your tasks and stay productive</p>
				</div>

				<AddTodoForm />
				<TodoList />
			</main>
		</div>
	);
}

export default function TodosPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<TodosContent />
		</QueryClientProvider>
	);
}
