// User types
export interface User {
	id: number;
	username: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateUserDto {
	username: string;
	email: string;
	password: string;
}

export interface UpdateUserDto {
	username?: string;
	email?: string;
	password?: string;
}

export interface LoginDto {
	email: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	user: User;
}

export interface MeResponse {
	message: string;
	user: User | null;
}

// Todo types
export interface Todo {
	id: number;
	userId: number;
	title: string;
	description?: string;
	completed: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTodoDto {
	title: string;
	description?: string;
}

export interface UpdateTodoDto {
	title?: string;
	description?: string;
	completed?: boolean;
}

// API Response types
export interface ApiError {
	statusCode: number;
	message: string;
	error: string;
}

// Auth context types
export interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}
