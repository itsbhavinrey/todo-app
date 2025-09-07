import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../lib/api-service';
import type { CreateTodoDto, UpdateTodoDto, Todo } from '../types';

// Query keys
export const todoKeys = {
	all: ['todos'] as const,
	lists: () => [...todoKeys.all, 'list'] as const,
	list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
	details: () => [...todoKeys.all, 'detail'] as const,
	detail: (id: number) => [...todoKeys.details(), id] as const,
};

// Hooks for todos
export const useTodos = () => {
	return useQuery({
		queryKey: todoKeys.lists(),
		queryFn: todoApi.getAll,
		staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
	});
};

export const useTodo = (id: number) => {
	return useQuery({
		queryKey: todoKeys.detail(id),
		queryFn: () => todoApi.getById(id),
		enabled: !!id,
	});
};

export const useCreateTodo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: todoApi.create,
		onSuccess: newTodo => {
			// Optimistically update the cache instead of invalidating
			queryClient.setQueryData(todoKeys.lists(), (oldData: Todo[] | undefined) => {
				if (!oldData) return [newTodo];
				return [...oldData, newTodo];
			});
		},
	});
};

export const useUpdateTodo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateTodoDto }) => todoApi.update(id, data),
		onSuccess: updatedTodo => {
			// Optimistically update the cache instead of invalidating
			queryClient.setQueryData(todoKeys.lists(), (oldData: Todo[] | undefined) => {
				if (!oldData) return [updatedTodo];
				return oldData.map((todo: Todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
			});
			queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
		},
	});
};

export const useToggleTodo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: todoApi.toggle,
		onSuccess: updatedTodo => {
			// Optimistically update the cache instead of invalidating
			queryClient.setQueryData(todoKeys.lists(), (oldData: Todo[] | undefined) => {
				if (!oldData) return [updatedTodo];
				return oldData.map((todo: Todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
			});
			queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
		},
	});
};

export const useDeleteTodo = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: todoApi.delete,
		onSuccess: (_, deletedId) => {
			// Optimistically update the cache instead of invalidating
			queryClient.setQueryData(todoKeys.lists(), (oldData: Todo[] | undefined) => {
				if (!oldData) return [];
				return oldData.filter((todo: Todo) => todo.id !== deletedId);
			});
			queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
		},
	});
};
