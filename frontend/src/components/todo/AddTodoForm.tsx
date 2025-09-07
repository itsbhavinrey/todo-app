'use client';

import React, { useState } from 'react';
import { useCreateTodo } from '../../hooks/use-todos';

export const AddTodoForm: React.FC = () => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);

	const createTodo = useCreateTodo();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim() === '') return;

		try {
			await createTodo.mutateAsync({
				title: title.trim(),
				description: description.trim() || undefined,
			});
			setTitle('');
			setDescription('');
			setIsExpanded(false);
		} catch (error) {
			console.error('Failed to create todo:', error);
		}
	};

	const handleCancel = () => {
		setTitle('');
		setDescription('');
		setIsExpanded(false);
	};

	return (
		<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6'>
			{!isExpanded ? (
				<button
					onClick={() => setIsExpanded(true)}
					className='w-full flex items-center justify-center space-x-2 py-3 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors'
				>
					<svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
					</svg>
					<span className='text-gray-600 dark:text-gray-400 font-medium'>Add a new todo</span>
				</button>
			) : (
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<input
							type='text'
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder='What needs to be done?'
							className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
							autoFocus
						/>
					</div>

					<div>
						<textarea
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder='Add a description (optional)'
							rows={2}
							className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
						/>
					</div>

					<div className='flex space-x-2'>
						<button
							type='submit'
							disabled={createTodo.isPending || title.trim() === ''}
							className='px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors'
						>
							{createTodo.isPending ? 'Adding...' : 'Add Todo'}
						</button>
						<button type='button' onClick={handleCancel} className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors'>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};
