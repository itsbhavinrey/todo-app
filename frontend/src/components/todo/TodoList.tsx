'use client';

import React from 'react';
import { useTodos } from '../../hooks/use-todos';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
	const { data: todos, isLoading, error } = useTodos();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
				<span className='ml-2 text-gray-600 dark:text-gray-400'>Loading todos...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
				<p className='text-red-800 dark:text-red-200'>Failed to load todos. Please try again.</p>
			</div>
		);
	}

	if (!todos || todos.length === 0) {
		return (
			<div className='text-center py-8'>
				<div className='text-gray-400 dark:text-gray-500 mb-4'>
					<svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1}
							d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
						/>
					</svg>
				</div>
				<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>No todos yet</h3>
				<p className='text-gray-600 dark:text-gray-400'>Create your first todo to get started!</p>
			</div>
		);
	}

	const completedTodos = todos.filter(todo => todo.completed);
	const pendingTodos = todos.filter(todo => !todo.completed);

	return (
		<div className='space-y-6'>
			{/* Stats */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4'>
					<div className='flex items-center'>
						<div className='p-2 bg-blue-100 dark:bg-blue-800 rounded-lg'>
							<svg className='w-6 h-6 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
								/>
							</svg>
						</div>
						<div className='ml-3'>
							<p className='text-sm font-medium text-blue-600 dark:text-blue-400'>Total</p>
							<p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>{todos.length}</p>
						</div>
					</div>
				</div>

				<div className='bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4'>
					<div className='flex items-center'>
						<div className='p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg'>
							<svg className='w-6 h-6 text-yellow-600 dark:text-yellow-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
							</svg>
						</div>
						<div className='ml-3'>
							<p className='text-sm font-medium text-yellow-600 dark:text-yellow-400'>Pending</p>
							<p className='text-2xl font-bold text-yellow-900 dark:text-yellow-100'>{pendingTodos.length}</p>
						</div>
					</div>
				</div>

				<div className='bg-green-50 dark:bg-green-900/20 rounded-lg p-4'>
					<div className='flex items-center'>
						<div className='p-2 bg-green-100 dark:bg-green-800 rounded-lg'>
							<svg className='w-6 h-6 text-green-600 dark:text-green-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
							</svg>
						</div>
						<div className='ml-3'>
							<p className='text-sm font-medium text-green-600 dark:text-green-400'>Completed</p>
							<p className='text-2xl font-bold text-green-900 dark:text-green-100'>{completedTodos.length}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Pending Todos */}
			{pendingTodos.length > 0 && (
				<div>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Pending Tasks ({pendingTodos.length})</h2>
					<div className='space-y-3'>
						{pendingTodos.map(todo => (
							<TodoItem key={todo.id} todo={todo} />
						))}
					</div>
				</div>
			)}

			{/* Completed Todos */}
			{completedTodos.length > 0 && (
				<div>
					<h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Completed Tasks ({completedTodos.length})</h2>
					<div className='space-y-3'>
						{completedTodos.map(todo => (
							<TodoItem key={todo.id} todo={todo} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};
