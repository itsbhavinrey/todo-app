import { apiClient, API_ENDPOINTS } from './api';
import type { User, CreateUserDto, UpdateUserDto, LoginDto, LoginResponse, MeResponse, Todo, CreateTodoDto, UpdateTodoDto } from '../types';

// Auth API functions
export const authApi = {
	login: async (loginData: LoginDto): Promise<LoginResponse> => {
		const response = await apiClient.post(API_ENDPOINTS.LOGIN, loginData);
		return response.data;
	},

	logout: async (): Promise<{ message: string }> => {
		const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
		return response.data;
	},

	getMe: async (): Promise<MeResponse> => {
		const response = await apiClient.post(API_ENDPOINTS.ME);
		return response.data;
	},
};

// User API functions
export const userApi = {
	create: async (userData: CreateUserDto): Promise<User> => {
		const response = await apiClient.post(API_ENDPOINTS.USERS, userData);
		return response.data;
	},

	getAll: async (): Promise<User[]> => {
		const response = await apiClient.get(API_ENDPOINTS.USERS);
		return response.data;
	},

	getById: async (id: number): Promise<User> => {
		const response = await apiClient.get(API_ENDPOINTS.USER_BY_ID(id));
		return response.data;
	},

	update: async (id: number, userData: UpdateUserDto): Promise<User> => {
		const response = await apiClient.patch(API_ENDPOINTS.USER_BY_ID(id), userData);
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(API_ENDPOINTS.USER_BY_ID(id));
	},
};

// Todo API functions
export const todoApi = {
	create: async (todoData: CreateTodoDto): Promise<Todo> => {
		const response = await apiClient.post(API_ENDPOINTS.TODOS, todoData);
		return response.data;
	},

	getAll: async (): Promise<Todo[]> => {
		const response = await apiClient.get(API_ENDPOINTS.TODOS);
		return response.data;
	},

	getById: async (id: number): Promise<Todo> => {
		const response = await apiClient.get(API_ENDPOINTS.TODO_BY_ID(id));
		return response.data;
	},

	update: async (id: number, todoData: UpdateTodoDto): Promise<Todo> => {
		const response = await apiClient.patch(API_ENDPOINTS.TODO_BY_ID(id), todoData);
		return response.data;
	},

	toggle: async (id: number): Promise<Todo> => {
		const response = await apiClient.patch(API_ENDPOINTS.TODO_TOGGLE(id));
		return response.data;
	},

	delete: async (id: number): Promise<void> => {
		await apiClient.delete(API_ENDPOINTS.TODO_BY_ID(id));
	},
};
