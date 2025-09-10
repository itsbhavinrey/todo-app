'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/auth-store';
import { queryClient } from '../../../lib/query-client';
import { Header } from '../../../components/layout/Header';
import { useTodo, useDeleteTodo } from '../../../hooks/use-todos';

function TodoDetailContent({ id }: { id: number }) {
	const { user, isAuthenticated, isLoading: authLoading, checkAuth, logout } = useAuthStore();
	const { data: todo, isLoading: todoLoading, error } = useTodo(id);
	const deleteTodo = useDeleteTodo();
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		}
	}, [isAuthenticated, authLoading, router]);

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this todo?')) {
			try {
				await deleteTodo.mutateAsync(id);
				router.push('/todos');
			} catch (error) {
				console.error('Failed to delete todo:', error);
			}
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			router.push('/signin');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	if (authLoading || todoLoading) {
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

	if (error) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<Header user={user} onLogout={handleLogout} />
				<main className='max-w-4xl mx-auto px-4 py-8'>
					<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
						<p className='text-red-800 dark:text-red-200'>Failed to load todo. Please try again.</p>
					</div>
					<div className='mt-4'>
						<Link href='/todos' className='text-blue-600 hover:text-blue-700 font-medium'>
							← Back to Todos
						</Link>
					</div>
				</main>
			</div>
		);
	}

	if (!todo) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
				<Header user={user} onLogout={handleLogout} />
				<main className='max-w-4xl mx-auto px-4 py-8'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Todo Not Found</h1>
						<p className='text-gray-600 dark:text-gray-400 mb-4'>The todo you're looking for doesn't exist.</p>
						<Link href='/todos' className='text-blue-600 hover:text-blue-700 font-medium'>
							← Back to Todos
						</Link>
					</div>
				</main>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<Header user={user} onLogout={handleLogout} />

			<main className='max-w-4xl mx-auto px-4 py-8'>
				<div className='mb-6'>
					<Link href='/todos' className='text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block'>
						← Back to Todos
					</Link>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
					<div className='flex items-start justify-between mb-6'>
						<div className='flex-1'>
							<div className='flex items-center space-x-3 mb-4'>
								<div
									className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
										todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600'
									}`}
								>
									{todo.completed && (
										<svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
											<path
												fillRule='evenodd'
												d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
												clipRule='evenodd'
											/>
										</svg>
									)}
								</div>
								<h1 className={`text-3xl font-bold ${todo.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{todo.title}</h1>
							</div>

							{todo.description && <p className={`text-lg mb-6 ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>{todo.description}</p>}
						</div>
					</div>

					<div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
							<div>
								<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>Created</h3>
								<p className='text-gray-900 dark:text-white'>{formatDate(todo.createdAt)}</p>
							</div>
							{todo.updatedAt !== todo.createdAt && (
								<div>
									<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-1'>Last Updated</h3>
									<p className='text-gray-900 dark:text-white'>{formatDate(todo.updatedAt)}</p>
								</div>
							)}
						</div>

						<div className='flex space-x-4'>
							<Link href={`/todos/${id}/edit`} className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'>
								Edit Todo
							</Link>
							<button
								onClick={handleDelete}
								disabled={deleteTodo.isPending}
								className='bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200'
							>
								{deleteTodo.isPending ? 'Deleting...' : 'Delete Todo'}
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

export default function TodoDetailPage({ params }: { params: { id: string } }) {
	const id = parseInt(params.id);

	if (isNaN(id)) {
		return (
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
				<div className='text-center'>
					<h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Invalid Todo ID</h1>
					<p className='text-gray-600 dark:text-gray-400'>The todo ID is not valid.</p>
				</div>
			</div>
		);
	}

	return (
		<QueryClientProvider client={queryClient}>
			<TodoDetailContent id={id} />
		</QueryClientProvider>
	);
}
