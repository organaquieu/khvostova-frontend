'use client';
import React from 'react';
import Image from 'next/image';

export default function AboutBrand() {
  return (
    
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-left mb-12">Онлайн-каталог ХВОСТОВА</h2>
        
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Блок с изображением */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/pictures/aboutbrand.png" // Путь к вашему изображению
                alt="О нашем бренде"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          
          {/* Блок с текстом */}
          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-xl font-semibold">ХВОСТОВА — это начинающий бренд одежды и аксессуаров. Мы нацелены создавать элегантную минималистичную одежду, подчеркивающую естественную привлекательность человека. Тонкие линии тела, классические цвета, изысканный вкус — вот что мы видим в наших работах. При создании аксессуаров «Хвостова» дизайнер вдохновлялся славянскими орнаментами, применяя в творческой работе соответствующие классическому рисунку цвета. </h3>
            {/* <p className="text-gray-600 leading-relaxed"> */}
            {/* </p> */}
            {/* </ul> */}
          </div>
        </div>
      </div>
    </section>
  );
}