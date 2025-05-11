import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await ordersApi.getAll();
      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data } = await ordersApi.getById(id);
      return data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: {
      items: Array<{
        productId: string;
        quantity: number;
        measurements?: Record<string, number>;
      }>;
      shippingAddress: string;
      contactPhone: string;
    }) => {
      const { data } = await ordersApi.create(orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
} 