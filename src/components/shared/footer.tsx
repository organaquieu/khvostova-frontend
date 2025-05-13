'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaTelegram, FaWhatsapp, FaVk, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Колонка 1: О компании */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/pictures/logoinv.png"
              alt="Khvostova"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-gray-400 text-sm sm:text-base">
            Дизайнерская одежда и аксессуары ручной работы из Ростова-на-Дону
          </p>
          <div className="flex space-x-4 pt-2">
            <SocialIcon 
              href="https://t.me/khvostova" 
              icon={<FaTelegram className="h-5 w-5" />}
            />
            <SocialIcon 
              href="https://wa.me/78005553535" 
              icon={<FaWhatsapp className="h-5 w-5" />}
            />
            <SocialIcon 
              href="https://vk.com/khvostova" 
              icon={<FaVk className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Колонка 2: Контакты */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Контакты</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-start">
              <FaPhone className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <a href="tel:+78005553535" className="hover:text-white transition-colors block text-sm sm:text-base">
                  +7 (800) 555-35-35
                </a>
                <span className="text-xs sm:text-sm">Ежедневно с 9:00 до 21:00</span>
              </div>
            </li>
            <li className="flex items-start">
              <FaEnvelope className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <a href="mailto:info@khvostova.ru" className="hover:text-white transition-colors text-sm sm:text-base">
                info@khvostova.ru
              </a>
            </li>
            <li className="flex items-start">
              <FaMapMarkerAlt className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block text-sm sm:text-base">г. Ростов-на-Дону, ул. Мечникова 79Б</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Колонка 3: Навигация */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Навигация</h3>
          <ul className="space-y-3 text-gray-400">
            <li>
              <Link href="/catalog" className="hover:text-white transition-colors text-sm sm:text-base">
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors text-sm sm:text-base">
                О нас
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="hover:text-white transition-colors text-sm sm:text-base">
                Доставка
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-white transition-colors text-sm sm:text-base">
                Контакты
              </Link>
            </li>
          </ul>
        </div>

        {/* Колонка 4: Подписка */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Подписаться на новости</h3>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">
            Узнавайте первыми о новых коллекциях и эксклюзивных предложениях
          </p>
          <form className="flex">
            <input 
              type="email" 
              placeholder="Ваш email" 
              className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500 w-full text-sm sm:text-base"
              required
            />
            <button 
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-r-md transition-colors flex items-center justify-center"
              aria-label="Подписаться"
            >
              <FaPaperPlane className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Нижняя часть футера */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-xs sm:text-sm text-center md:text-left mb-3 md:mb-0">
          © {new Date().getFullYear()} Khvostova. Все права защищены
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-xs sm:text-sm transition-colors">
            Политика конфиденциальности
          </Link>
          <Link href="/wholesale" className="text-gray-500 hover:text-gray-300 text-xs sm:text-sm transition-colors">
            Оптовым покупателям
          </Link>
        </div>
      </div>
    </footer>
  );
}

// Компонент иконки социальной сети
function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors text-gray-300 hover:text-white"
      aria-label={`Мы в ${href.includes('t.me') ? 'Telegram' : 
                 href.includes('whatsapp') ? 'WhatsApp' :
                 href.includes('vk.com') ? 'ВКонтакте' : 'Instagram'}`}
    >
      {icon}
    </a>
  );
}

