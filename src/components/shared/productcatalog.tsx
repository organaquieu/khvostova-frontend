'use client';

import { useState } from 'react';
import Image from 'next/image';
import {ProductModal} from '@/components/shared/productmodal'


type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[]
  category: 'clothing' | 'accessories'; // Добавляем категории
  productType: 'dress' | 'bracelet' | 'necklace';
};

const products: Product[] = [
  {
    id: '1',
    name: 'Платье Khvostova',
    description: 'Платье Khvostova выполнено из эмиратского трикотажа благородного черного цвета с особенно нежной, эластичной текстурой, поверх которой струится мягкая сетчатая ткань, подчеркивающая изящные изгибы тела',
    price: 7770,
    image: '/pictures/dress.PNG',
    images: ['/pictures/dress.PNG', '/pictures/dress2.JPG', '/pictures/dress3.JPG'],
    category: 'clothing',
    productType: 'dress'
  },
  {
    id: '2',
    name: 'Браслет Русский женский',
    description: 'Данный браслет изготавливается индивидуально для каждого покупателя, основываясь на размерах запястья и ладони. Для упрощения процесса изготовления мы можем предложить усовершенствовать изделие и сделать его подходящим каждому, заменив застежку на регулируемую',
    price: 3000,
    image: '/pictures/brac1.png',
    images: ['/pictures/brac1.png', '/pictures/brac12.JPG'],
    category: 'accessories',
    productType: 'bracelet'
  },
  {
    id: '3',
    name: 'Браслет Русский мужской',
    description: 'Мужской браслет полностью повторяет орнамент женского браслета, но выглядит брутальнее и минималистичнее. Также предлагаем использование регулируемой застежки.',
    price: 2500,
    image: '/pictures/brac2.png',
    images: ['/pictures/brac2.png'],
    category: 'accessories',
    productType: 'bracelet'
  },
  {
    id: '4',
    name: 'Ожерелье',
    description: 'Ожерелье сконструировано уже с регулируемой застежкой, поэтому сможет подойти любому носителю',
    price: 5000,
    image: '/pictures/necklace.png',
    images: ['/pictures/necklace.png', '/pictures/necklace22.png', '/pictures/necklace3.JPG'],
    category: 'accessories',
    productType: 'necklace'
  }
];

// 
export default function ProductCatalog() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Каталог товаров</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Модальное окно с деталями товара */}
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </section>
  );
}





// 'use client';

// import Image from 'next/image';
// import Link from 'next/link';

// const products = [
//   {
//     id: 1,
//     name: 'Платье Khvostova',
//     description: 'Платье Khvostova выполнено из эмиратского трикотажа благородного черного цвета с особенно нежной, эластичной текстурой...',
//     price: 7770,
//     image: '/pictures/dress.png'
//   },
//   {
//     id: 2,
//     name: 'Браслет Русский женский',
//     description: 'Данный браслет изготавливается индивидуально для каждого покупателя...',
//     price: 3000,
//     image: '/pictures/brac1.png'
//   },
//   {
//     id: 3,
//     name: 'Браслет Русский мужской',
//     description: 'Мужской браслет полностью повторяет орнамент женского браслета...',
//     price: 2500,
//     image: '/pictures/brac2.png'
//   },
//   {
//     id: 4,
//     name: 'Ожерелье',
//     description: 'Ожерелье сконструировано уже с регулируемой застежкой...',
//     price: 5000,
//     image: '/pictures/necklace.png'
//   }
// ];

// export default function ProductCatalog() {
//   return (
//     <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl font-bold text-center mb-12">Каталог товаров</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {products.map((product) => (
//             <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
//               <div className="relative h-64">
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   fill
//                   className="object-cover"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                 />
//               </div>
//               <div className="p-6">
//                 <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
//                 <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
//                   <Link 
//                     href={`/product/${product.id}`}
//                     className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//                   >
//                     Подробнее
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }