'use client';

import React, { useState } from 'react';
import { useUpdateTodo, useToggleTodo, useDeleteTodo } from '../../hooks/use-todos';
import type { Todo } from '../../types';

interface TodoItemProps {
	todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(todo.title);
	const [editDescription, setEditDescription] = useState(todo.description || '');

	const updateTodo = useUpdateTodo();
	const toggleTodo = useToggleTodo();
	const deleteTodo = useDeleteTodo();

	const handleToggle = async () => {
		try {
			await toggleTodo.mutateAsync(todo.id);
		} catch (error) {
			console.error('Failed to toggle todo:', error);
		}
	};

	const handleSave = async () => {
		if (editTitle.trim() === '') return;

		try {
			await updateTodo.mutateAsync({
				id: todo.id,
				data: {
					title: editTitle.trim(),
					description: editDescription.trim() || undefined,
				},
			});
			setIsEditing(false);
		} catch (error) {
			console.error('Failed to update todo:', error);
		}
	};

	const handleCancel = () => {
		setEditTitle(todo.title);
		setEditDescription(todo.description || '');
		setIsEditing(false);
	};

	const handleDelete = async () => {
		if (window.confirm('Are you sure you want to delete this todo?')) {
			try {
				await deleteTodo.mutateAsync(todo.id);
			} catch (error) {
				console.error('Failed to delete todo:', error);
			}
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 ${todo.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-blue-500'}`}>
			<div className='flex items-start space-x-3'>
				<button
					onClick={handleToggle}
					disabled={toggleTodo.isPending}
					className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
						todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
					}`}
				>
					{todo.completed && (
						<svg className='w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
							<path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
						</svg>
					)}
				</button>

				<div className='flex-1 min-w-0'>
					{isEditing ? (
						<div className='space-y-3'>
							<input
								type='text'
								value={editTitle}
								onChange={e => setEditTitle(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='Todo title'
								autoFocus
							/>
							<textarea
								value={editDescription}
								onChange={e => setEditDescription(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
								placeholder='Description (optional)'
								rows={2}
							/>
							<div className='flex space-x-2'>
								<button
									onClick={handleSave}
									disabled={updateTodo.isPending || editTitle.trim() === ''}
									className='px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm rounded-lg transition-colors'
								>
									{updateTodo.isPending ? 'Saving...' : 'Save'}
								</button>
								<button onClick={handleCancel} className='px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors'>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<div>
							<h3 className={`text-lg font-medium ${todo.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{todo.title}</h3>
							{todo.description && <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>{todo.description}</p>}
							<p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
								Created: {formatDate(todo.createdAt)}
								{todo.updatedAt !== todo.createdAt && <span> • Updated: {formatDate(todo.updatedAt)}</span>}
							</p>
						</div>
					)}
				</div>

				{!isEditing && (
					<div className='flex space-x-2'>
						<button onClick={() => setIsEditing(true)} className='p-1 text-gray-400 hover:text-blue-600 transition-colors' title='Edit todo'>
							<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
								/>
							</svg>
						</button>
						<button onClick={handleDelete} disabled={deleteTodo.isPending} className='p-1 text-gray-400 hover:text-red-600 transition-colors' title='Delete todo'>
							<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
								/>
							</svg>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
