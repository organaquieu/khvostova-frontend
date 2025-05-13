'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'clothing' | 'accessories';
  productType: 'dress' | 'bracelet' | 'necklace';
};

export function ProductModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useUser();
  const cart = useCart();
  const [customMeasurement, setCustomMeasurement] = useState('');
  const [step, setStep] = useState<'details' | 'measurements' | 'checkout'>('details');
  const [measurements, setMeasurements] = useState({
    shoulders: '',
    chest: '',
    waist: '',
    hips: '',
    wrist: '',
    neck: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderData, setOrderData] = useState({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    contactMethod: 'WhatsApp'
  });

  // Заполняем данные пользователя при загрузке
  useEffect(() => {
    if (user) {
      setOrderData({
        lastName: user.name?.split(' ')[1] || '',
        firstName: user.name?.split(' ')[0] || '',
        phone: user.phone || '',
        email: user.email || '',
        contactMethod: 'WhatsApp'
      });
    }
  }, [user]);

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);

    if (value === '' || (/^\d+$/.test(value) && numValue <= 1000)) {
      setMeasurements(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      toast.error('Недопустимое значение (0-1000)');
    }
  };

  const handleSpecialMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maxValue = name === 'wrist' ? 50 : 100; // 50 см для запястья, 100 см для шеи
    const numValue = parseInt(value);

    if (value === '' || (/^\d+$/.test(value) && numValue <= maxValue)) {
      setMeasurements(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      toast.error(`Максимальное значение: ${maxValue} см`);
    }
  };

  const handleAddToCart = () => {
    console.log('Current user state:', user);
    
    if (!user) {
      console.log('User is not authenticated');
      toast.error('Пожалуйста, авторизуйтесь, чтобы добавить товар в корзину');
      return;
    }

    if (!product) return;
    
    const initialMeasurements = {
      shoulders: undefined,
      waist: undefined,
      hips: undefined,
      wrist: undefined,
      neck: undefined
    };

    console.log('Adding to cart:', {
      product,
      initialMeasurements,
      user
    });
    
    cart.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      productType: product.productType,
      quantity: 1,
      measurements: initialMeasurements
    });
    
    toast.success('Товар добавлен в корзину');
    onClose();
  };

  const validateMeasurements = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (product.productType === 'dress') {
      ['shoulders', 'chest', 'waist', 'hips'].forEach(field => {
        if (!measurements[field as keyof typeof measurements]) {
          newErrors[field] = 'Пожалуйста, заполните поле';
          isValid = false;
        }
      });
    } else if (product.productType === 'bracelet') {
      if (!measurements.wrist) {
        newErrors.wrist = 'Пожалуйста, заполните поле';
        isValid = false;
      }
    } else if (product.productType === 'necklace') {
      if (!measurements.neck) {
        newErrors.neck = 'Пожалуйста, заполните поле';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateOrderData = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!orderData.lastName) {
      newErrors.lastName = 'Пожалуйста, заполните поле';
      isValid = false;
    }
    if (!orderData.firstName) {
      newErrors.firstName = 'Пожалуйста, заполните поле';
      isValid = false;
    }
    if (!orderData.phone) {
      newErrors.phone = 'Пожалуйста, заполните поле';
      isValid = false;
    }
    if (!orderData.email) {
      newErrors.email = 'Пожалуйста, заполните поле';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateMeasurements()) {
      setStep('checkout');
    } else {
      toast.error('Пожалуйста, заполните все обязательные поля');
    }
  };

  const handleSubmitOrder = () => {
    if (validateOrderData()) {
      toast.success('Спасибо за заказ! В ближайшее время с Вами свяжется администратор!');
      onClose();
      // Здесь можно добавить отправку данных на сервер
    }
  };

  const renderMeasurementsStep = () => {
    switch (product.productType) {
      case 'bracelet':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Размер запястья (в см)</h3>
            <Input
              name="wrist"
              value={measurements.wrist}
              onChange={handleSpecialMeasurementChange}
              placeholder="Введите размер запястья (до 50 см)"
              className={errors.wrist ? 'border-red-500' : ''}
            />
            {errors.wrist && <p className="text-red-500 text-sm">{errors.wrist}</p>}
          </div>
        );
      case 'necklace':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Обхват шеи (в см)</h3>
            <Input
              name="neck"
              value={measurements.neck}
              onChange={handleSpecialMeasurementChange}
              placeholder="Введите обхват шеи (до 100 см)"
              className={errors.neck ? 'border-red-500' : ''}
            />
            {errors.neck && <p className="text-red-500 text-sm">{errors.neck}</p>}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Замеры (в см)</h3>
            {[
              { name: 'shoulders', label: 'Ширина плеч' },
              { name: 'chest', label: 'Обхват груди' },
              { name: 'waist', label: 'Обхват талии' },
              { name: 'hips', label: 'Обхват бёдер' }
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block mb-1">{label}</label>
                <Input
                  name={name}
                  value={measurements[name as keyof typeof measurements]}
                  onChange={handleMeasurementChange}
                  className={errors[name] ? 'border-red-500' : ''}
                />
                {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl h-[90vh] md:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 'details' ? product.name : 
             step === 'measurements' ? 'Заполните замеры' : 'Оформление заказа'}
          </DialogTitle>
        </DialogHeader>

        {step === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${product.name} - фото ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Описание</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="text-2xl font-bold">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 py-6 text-lg"
                  variant="outline"
                >
                  Добавить в корзину
                </Button>
                <Button 
                  onClick={() => setStep('measurements')}
                  className="flex-1 py-6 text-lg"
                >
                  Оформить заказ
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'measurements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${product.name} - фото ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>

            <div className="space-y-6">
              {renderMeasurementsStep()}

              <div className="flex items-center space-x-4 pt-4">
                <label className="font-medium">Количество:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3"
                  >
                    -
                  </Button>
                  <span className="px-4">{quantity}</span>
                  <Button
                    variant="ghost"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleNextStep}
                className="w-full py-6 text-lg mt-4"
              >
                Продолжить
              </Button>
            </div>
          </div>
        )}

        {step === 'checkout' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ваш заказ</h3>
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-20 h-20 rounded-md overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p>Количество: {quantity}</p>
                  {product.productType === 'bracelet' && measurements.wrist && (
                    <p>Размер запястья: {measurements.wrist} см</p>
                  )}
                  {product.productType === 'necklace' && measurements.neck && (
                    <p>Обхват шеи: {measurements.neck} см</p>
                  )}
                  {product.productType === 'dress' && (
                    <>
                      <p>Плечи: {measurements.shoulders} см</p>
                      <p>Грудь: {measurements.chest} см</p>
                      <p>Талия: {measurements.waist} см</p>
                      <p>Бёдра: {measurements.hips} см</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Контактные данные</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Фамилия*</label>
                  <Input
                    name="lastName"
                    value={orderData.lastName}
                    onChange={(e) => setOrderData({...orderData, lastName: e.target.value})}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block mb-1">Имя*</label>
                  <Input
                    name="firstName"
                    value={orderData.firstName}
                    onChange={(e) => setOrderData({...orderData, firstName: e.target.value})}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block mb-1">Телефон*</label>
                  <Input
                    name="phone"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                    className={errors.phone ? 'border-red-500' : ''}
                    placeholder="+7 (___) ___-__-__"
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block mb-1">E-mail*</label>
                  <Input
                    name="email"
                    value={orderData.email}
                    onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                    className={errors.email ? 'border-red-500' : ''}
                    type="email"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div>
                  <label className="block mb-1">Предпочтительный вид связи*</label>
                  <Select
                    value={orderData.contactMethod}
                    onValueChange={(value) => setOrderData({...orderData, contactMethod: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите способ связи" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                      <SelectItem value="Telegram">Telegram</SelectItem>
                      <SelectItem value="Phone">Телефонный звонок</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleSubmitOrder}
                className="w-full py-6 text-lg mt-6"
              >
                Подтвердить заказ
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}