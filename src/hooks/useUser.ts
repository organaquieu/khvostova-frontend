import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api';

export function useUser() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data } = await userApi.getProfile();
      return data;
    },
  });
}

export function useMeasurements() {
  return useQuery({
    queryKey: ['user', 'measurements'],
    queryFn: async () => {
      const { data } = await userApi.getMeasurements();
      return data;
    },
  });
}

export function useUpdateMeasurements() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (measurements: {
      shoulders?: number;
      waist?: number;
      hips?: number;
      wrist?: number;
      neck?: number;
    }) => {
      const { data } = await userApi.updateMeasurements(measurements);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'measurements'] });
    },
  });
} 