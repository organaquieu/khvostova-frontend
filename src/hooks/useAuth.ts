import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      try {
        const { data } = await authApi.getProfile();
        return data;
      } catch (error) {
        return null;
      }
    },
  });

  const login = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const { data } = await authApi.login(credentials);
      localStorage.setItem('token', data.token);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      router.push('/');
    },
  });

  const register = useMutation({
    mutationFn: async (userData: { 
      username: string; 
      password: string; 
      email: string; 
      phone: string;
      firstName: string;
    }) => {
      const { data } = await authApi.register(userData);
      localStorage.setItem('token', data.token);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      router.push('/');
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      await authApi.logout();
      localStorage.removeItem('token');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      router.push('/');
    },
  });

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
} 