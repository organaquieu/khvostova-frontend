'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import toast from 'react-hot-toast'; 

export default function Cart() {
  const cart = useCart();
  if (!cart) return null;

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    total,
    itemCount,
    clearCart,
  } = cart;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Корзина ({itemCount})</h1>
      
      {cartItems.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="relative w-24 h-24 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  {item.size && <p>Размер: {item.size}</p>}
                  {item.customMeasurement && <p>Замер: {item.customMeasurement} см</p>}
                  <p className="font-bold">{item.price.toLocaleString('ru-RU')} ₽</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold">Итого:</span>
              <span className="text-xl font-bold">
                {total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="px-4 py-2 border rounded-md"
              >
                Очистить корзину
              </button>
              <button
                onClick={() => toast.success('Заказ оформлен!')}
                className="px-4 py-2 bg-black text-white rounded-md flex-1"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}