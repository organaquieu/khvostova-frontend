'use client';

import { useParams } from 'next/navigation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';
import { useUser } from '@/context/UserContext';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  productType: 'dress' | 'bracelet' | 'necklace';
};

export default function ProductModal() {
  const params = useParams();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(params.id as string);
  const addToCart = useAddToCart();
  const { user } = useUser();

  const handleClose = () => {
    router.back();
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Пожалуйста, авторизуйтесь, чтобы добавить товар в корзину');
      return;
    }

    if (product) {
      addToCart.mutate({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        productType: product.productType
      }, {
        onSuccess: () => {
          toast.success('Товар добавлен в корзину');
          handleClose();
        },
        onError: () => {
          toast.error('Ошибка при добавлении товара в корзину');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent>
          <div className="flex justify-center items-center h-64">
            <p>Загрузка...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !product) {
    return (
      <Dialog open onOpenChange={handleClose}>
        <DialogContent>
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error ? 'Ошибка при загрузке товара' : 'Товар не найден'}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-xl font-semibold">
              {product.price.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-gray-600">{product.description}</p>
            <Button
              onClick={handleAddToCart}
              className="w-full"
              disabled={addToCart.isPending}
            >
              {addToCart.isPending ? 'Добавление...' : 'Добавить в корзину'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
