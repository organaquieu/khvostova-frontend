import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function useCart() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return [];
      }
      try {
        const { data } = await cartApi.getCart();
        return data;
      } catch (error) {
        console.error('Error fetching cart:', error);
        return [];
      }
    },
    enabled: isAuthenticated,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
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
      if (!isAuthenticated) {
        toast.error('Пожалуйста, войдите в аккаунт');
        router.push('/');
        throw new Error('Not authenticated');
      }
      try {
        const { data } = await cartApi.addToCart(cartItem);
        toast.success('Товар добавлен в корзину');
        return data;
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Ошибка при добавлении товара в корзину');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: { quantity?: number; measurements?: Record<string, number> } }) => {
      if (!isAuthenticated) {
        toast.error('Пожалуйста, войдите в аккаунт');
        router.push('/');
        throw new Error('Not authenticated');
      }
      try {
        const { data: responseData } = await cartApi.updateCartItem(itemId, data);
        return responseData;
      } catch (error) {
        console.error('Error updating cart item:', error);
        toast.error('Ошибка при обновлении корзины');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!isAuthenticated) {
        toast.error('Пожалуйста, войдите в аккаунт');
        router.push('/');
        throw new Error('Not authenticated');
      }
      try {
        await cartApi.removeFromCart(itemId);
        toast.success('Товар удален из корзины');
      } catch (error) {
        console.error('Error removing from cart:', error);
        toast.error('Ошибка при удалении товара из корзины');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  return useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        toast.error('Пожалуйста, войдите в аккаунт');
        router.push('/');
        throw new Error('Not authenticated');
      }
      try {
        await cartApi.clearCart();
        toast.success('Корзина очищена');
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Ошибка при очистке корзины');
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
} 