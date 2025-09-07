import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchInterval: false, // Disable automatic refetching
			staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
		},
		mutations: {
			retry: 1,
		},
	},
});
