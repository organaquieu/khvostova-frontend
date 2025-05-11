import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '@/lib/api';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoryApi.getAll();
      return data;
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const { data } = await categoryApi.getById(id);
      return data;
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryData: { name: string; description?: string }) => {
      const { data } = await categoryApi.create(categoryData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; description?: string } }) => {
      const { data: responseData } = await categoryApi.update(id, data);
      return responseData;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await categoryApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
} 