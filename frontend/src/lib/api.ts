import axios from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor for logging
apiClient.interceptors.request.use(
	config => {
		console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
			url: config.url,
			method: config.method,
			baseURL: config.baseURL,
			headers: config.headers,
		});
		return config;
	},
	error => {
		console.error('❌ Request Error:', error);
		return Promise.reject(error);
	},
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
	response => {
		console.log(`✅ ${response.status} ${response.config.url}`);
		return response;
	},
	error => {
		console.error('❌ Response Error:', error.response?.data || error.message);
		return Promise.reject(error);
	},
);

// API endpoints
export const API_ENDPOINTS = {
	// Auth endpoints
	LOGIN: '/auth/login',
	LOGOUT: '/auth/logout',
	ME: '/auth/me',

	// User endpoints
	USERS: '/users',
	USER_BY_ID: (id: number) => `/users/${id}`,

	// Todo endpoints
	TODOS: '/todos',
	TODO_BY_ID: (id: number) => `/todos/${id}`,
	TODO_TOGGLE: (id: number) => `/todos/${id}/toggle`,
} as const;
