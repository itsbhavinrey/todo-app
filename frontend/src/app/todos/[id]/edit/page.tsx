'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../../../../store/auth-store';
import { queryClient } from '../../../../lib/query-client';
import { Header } from '../../../../components/layout/Header';
import { useTodo, useUpdateTodo } from '../../../../hooks/use-todos';

function EditTodoContent({ id }: { id: number }) {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [error, setError] = useState('');

	const { user, isAuthenticated, isLoading: authLoading, checkAuth, logout } = useAuthStore();
	const { data: todo, isLoading: todoLoading, error: todoError } = useTodo(id);
	const updateTodo = useUpdateTodo();
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push('/signin');
		}
	}, [isAuthenticated, authLoading, router]);

	useEffect(() => {
		if (todo) {
			setTitle(todo.title);
			setDescription(todo.description || '');
		}
	}, [todo]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (title.trim() === '') {
			setError('Title is required');
			return;
		}

		try {
			await updateTodo.mutateAsync({
				id,
				data: {
					title: title.trim(),
					description: description.trim() || undefined,
				},
			});
			router.push(`/todos/${id}`);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to update todo. Please try again.');
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

	if (todoError) {
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
						<p className='text-gray-600 dark:text-gray-400 mb-4'>The todo you're trying to edit doesn't exist.</p>
						<Link href='/todos' className='text-blue-600 hover:text-blue-700 font-medium'>
							← Back to Todos
						</Link>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<Header user={user} onLogout={handleLogout} />

			<main className='max-w-2xl mx-auto px-4 py-8'>
				<div className='mb-6'>
					<Link href={`/todos/${id}`} className='text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block'>
						← Back to Todo
					</Link>
					<h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Edit Todo</h1>
					<p className='text-gray-600 dark:text-gray-400 mt-2'>Update your todo details</p>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
					<form onSubmit={handleSubmit} className='space-y-6'>
						<div>
							<label htmlFor='title' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Title *
							</label>
							<input
								type='text'
								id='title'
								value={title}
								onChange={e => setTitle(e.target.value)}
								required
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='What needs to be done?'
								autoFocus
							/>
						</div>

						<div>
							<label htmlFor='description' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
								Description
							</label>
							<textarea
								id='description'
								value={description}
								onChange={e => setDescription(e.target.value)}
								rows={4}
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='Add a description (optional)'
							/>
						</div>

						{error && (
							<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
								<p className='text-red-800 dark:text-red-200 text-sm'>{error}</p>
							</div>
						)}

						<div className='flex space-x-4'>
							<button
								type='submit'
								disabled={updateTodo.isPending || title.trim() === ''}
								className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200'
							>
								{updateTodo.isPending ? 'Updating...' : 'Update Todo'}
							</button>
							<Link href={`/todos/${id}`} className='bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-center'>
								Cancel
							</Link>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}

export default function EditTodoPage({ params }: { params: { id: string } }) {
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
			<EditTodoContent id={id} />
		</QueryClientProvider>
	);
}
