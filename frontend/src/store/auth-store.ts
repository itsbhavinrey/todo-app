import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, userApi } from '../lib/api-service';
import type { User } from '../types';

interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;

	// Actions
	login: (email: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isLoading: false,
			isAuthenticated: false,

			login: async (email: string, password: string) => {
				set({ isLoading: true });
				try {
					const response = await authApi.login({ email, password });
					set({
						user: response.user,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error) {
					set({ isLoading: false });
					throw error;
				}
			},

			register: async (username: string, email: string, password: string) => {
				set({ isLoading: true });
				try {
					await userApi.create({ username, email, password });
					// After successful registration, automatically log in
					const response = await authApi.login({ email, password });
					set({
						user: response.user,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error) {
					set({ isLoading: false });
					throw error;
				}
			},

			logout: async () => {
				set({ isLoading: true });
				try {
					await authApi.logout();
				} catch (error) {
					console.error('Logout error:', error);
				} finally {
					set({
						user: null,
						isAuthenticated: false,
						isLoading: false,
					});
				}
			},

			checkAuth: async () => {
				set({ isLoading: true });
				try {
					const response = await authApi.getMe();
					if (response.user) {
						set({
							user: response.user,
							isAuthenticated: true,
							isLoading: false,
						});
					} else {
						set({
							user: null,
							isAuthenticated: false,
							isLoading: false,
						});
					}
				} catch (error) {
					// Only log if it's not a 401 (unauthorized) error
					if (error?.response?.status !== 401) {
						console.log('Auth check failed:', error);
					}
					set({
						user: null,
						isAuthenticated: false,
						isLoading: false,
					});
				}
			},

			setLoading: (loading: boolean) => {
				set({ isLoading: loading });
			},
		}),
		{
			name: 'auth-storage',
			partialize: state => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
