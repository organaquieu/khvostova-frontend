'use client';

import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productType: 'dress' | 'bracelet' | 'necklace';
  measurements?: {
    shoulders?: number;
    waist?: number;
    hips?: number;
    wrist?: number;
    neck?: number;
  };
}

export default function CartContent() {
  const { data: cartItems = [], isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const createOrder = useCreateOrder();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleMeasurementChange = (itemId: string, measurementType: string, value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    const item = cartItems.find((item: CartItem) => item.id === itemId);
    if (!item) return;

    const newMeasurements = {
      ...item.measurements,
      [measurementType]: numValue
    };

    updateCartItem.mutate({
      id: itemId,
      data: {
        quantity: item.quantity,
        measurements: newMeasurements
      }
    });
  };

  const validateMeasurements = (item: CartItem) => {
    const itemMeasurements = item.measurements || {};
    switch (item.productType) {
      case 'dress':
        return itemMeasurements.shoulders && itemMeasurements.waist && itemMeasurements.hips;
      case 'bracelet':
        return itemMeasurements.wrist;
      case 'necklace':
        return itemMeasurements.neck;
      default:
        return true;
    }
  };

  const handleCheckout = () => {
    if (!shippingAddress || !contactPhone) {
      toast.error('Пожалуйста, заполните адрес доставки и контактный телефон');
      return;
    }

    const itemsWithInvalidMeasurements = cartItems.filter((item: CartItem) => !validateMeasurements(item));
    if (itemsWithInvalidMeasurements.length > 0) {
      toast.error('Пожалуйста, укажите все необходимые замеры для следующих товаров:\n' +
        itemsWithInvalidMeasurements.map((item: CartItem) => item.name).join('\n'));
      return;
    }

    createOrder.mutate({
      items: cartItems.map((item: CartItem) => ({
        productId: item.id,
        quantity: item.quantity,
        measurements: item.measurements
      })),
      shippingAddress,
      contactPhone
    }, {
      onSuccess: () => {
        toast.success('Заказ успешно оформлен!');
        clearCart.mutate();
      },
      onError: (error) => {
        toast.error('Произошла ошибка при оформлении заказа');
        console.error('Order creation error:', error);
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-xl text-gray-500">Корзина пуста</p>
        <Button
          className="mt-4"
          onClick={() => window.location.href = '/'}
        >
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Корзина</h1>
      <div className="space-y-4">
        {cartItems.map((item: CartItem) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500">{item.price} ₽</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => updateCartItem.mutate({
                      id: item.id,
                      data: { quantity: item.quantity - 1 }
                    })}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateCartItem.mutate({
                      id: item.id,
                      data: { quantity: item.quantity + 1 }
                    })}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart.mutate(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                Удалить
              </button>
            </div>
            {item.productType === 'dress' && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Плечи:</Label>
                  <Input
                    type="number"
                    value={item.measurements?.shoulders || ''}
                    onChange={(e) => handleMeasurementChange(item.id, 'shoulders', e.target.value)}
                    placeholder="см"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Талия:</Label>
                  <Input
                    type="number"
                    value={item.measurements?.waist || ''}
                    onChange={(e) => handleMeasurementChange(item.id, 'waist', e.target.value)}
                    placeholder="см"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Бедра:</Label>
                  <Input
                    type="number"
                    value={item.measurements?.hips || ''}
                    onChange={(e) => handleMeasurementChange(item.id, 'hips', e.target.value)}
                    placeholder="см"
                  />
                </div>
              </div>
            )}
            {item.productType === 'bracelet' && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Запястье:</Label>
                  <Input
                    type="number"
                    value={item.measurements?.wrist || ''}
                    onChange={(e) => handleMeasurementChange(item.id, 'wrist', e.target.value)}
                    placeholder="см"
                  />
                </div>
              </div>
            )}
            {item.productType === 'necklace' && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Шея:</Label>
                  <Input
                    type="number"
                    value={item.measurements?.neck || ''}
                    onChange={(e) => handleMeasurementChange(item.id, 'neck', e.target.value)}
                    placeholder="см"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="border-t pt-4">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Адрес доставки:</Label>
              <Input
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Введите адрес доставки"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Контактный телефон:</Label>
              <Input
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Введите номер телефона"
              />
            </div>
            <div className="flex justify-between items-center">
              <span>Итого:</span>
              <span className="font-medium">{total} ₽</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? 'Оформление заказа...' : 'Оформить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 