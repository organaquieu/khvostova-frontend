import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await cartApi.getCart();
      return data;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cartItem: {
      id: string;
      name: string;
      price: number;
      image: string;
      quantity: number;
      productType: 'dress' | 'bracelet' | 'necklace';
      measurements?: Record<string, number>;
    }) => {
      const { data } = await cartApi.addToCart(cartItem);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: { quantity?: number; measurements?: Record<string, number> } }) => {
      const { data: responseData } = await cartApi.updateCartItem(itemId, data);
      return responseData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      await cartApi.removeFromCart(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await cartApi.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
} 