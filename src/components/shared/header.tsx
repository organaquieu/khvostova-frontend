'use client';
// import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// import { Container } from './container';
// import { SearchInput } from './search-input';
// import { cn } from '@/lib/utils';
import Link from 'next/link';
// import { CartButton } from './cart-button';
// import { AuthModal } from './modals/auth-modal';
// import { ProfileButton } from './profile-button';
// import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import RegisterModal from '../auth/RegisterModal';
import { useUser } from '@/context/UserContext';

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export default function Header() {
  const router = useRouter();
  const cart = useCart();
  const { register, login, logout, user } = useAuth();
  const { user: userContext, setUser } = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    login: '',
    phone: '',
    email: '',
    password: ''
  });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToCatalog = () => {
    // Если мы уже на главной, просто скроллим
    if (window.location.pathname === '/') {
      const catalogSection = document.getElementById('catalog-section');
      if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Если на другой странице, переходим на главную с якорем
      router.push('/#catalog-section');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({
        username: loginData.login,
        password: loginData.password,
      });
      toast.success('Вход выполнен успешно');
      setShowLogin(false);
      setLoginData({ login: '', password: '' });
    } catch (error: any) {
      toast.error(error?.message || 'Ошибка при входе');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name || !registerData.login || !registerData.password || !registerData.email || !registerData.phone) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }
    try {
      await register.mutateAsync({
        username: registerData.login,
        password: registerData.password,
        firstName: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
      });
      toast.success(`Здравствуйте, ${registerData.name}!`);
      setShowRegister(false);
      setRegisterData({
        name: '',
        login: '',
        phone: '',
        email: '',
        password: ''
      });
    } catch (error: any) {
      toast.error(error?.message || 'Ошибка при регистрации');
    }
  };

  const handleLogout = () => {
    logout.mutate();
    toast.success('Вы успешно вышли из аккаунта');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Логотип */}
        <button onClick={scrollToTop} className="flex items-center">
          <Image
            src="/pictures/logo.png"
            alt="{ХВОСТОВА}"
            width={240}
            height={80}
            className="h-10 w-auto"
          />
        </button>

        {/* Бургер-меню для мобильных */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Открыть меню"
        >
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Навигация для десктопа */}
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={scrollToCatalog}
            className="px-4 py-2 bg-[#4100FA] text-white rounded-md hover:bg-[#3500D0] transition-colors"
          >
            Каталог
          </button>
          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {mounted && cart?.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#4100FA] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 border border-[#4100FA] text-[#4100FA] rounded-md hover:bg-[#4100FA] hover:text-white transition-colors"
              >
                Выйти
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setShowLogin(!showLogin)}
                  className="px-4 py-2 border border-[#4100FA] text-[#4100FA] rounded-md hover:bg-[#4100FA] hover:text-white transition-colors"
                >
                  Вход
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-4 py-2 bg-[#4100FA] text-white rounded-md hover:bg-[#3500D0] transition-colors"
                >
                  Регистрация
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end md:hidden">
          <div className="bg-white w-64 h-full p-6 flex flex-col space-y-4">
            <button
              className="self-end mb-4"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Закрыть меню"
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button onClick={() => { scrollToCatalog(); setMobileMenuOpen(false); }} className="w-full px-4 py-2 bg-[#4100FA] text-white rounded-md hover:bg-[#3500D0] transition-colors">
              Каталог
            </button>
            <Link href="/cart" className="w-full flex items-center px-4 py-2 border rounded-md">
              Корзина
              {mounted && cart?.itemCount > 0 && (
                <span className="ml-2 bg-[#4100FA] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full px-4 py-2 border border-[#4100FA] text-[#4100FA] rounded-md hover:bg-[#4100FA] hover:text-white transition-colors">
                Выйти
              </button>
            ) : (
              <>
                <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }} className="w-full px-4 py-2 border border-[#4100FA] text-[#4100FA] rounded-md hover:bg-[#4100FA] hover:text-white transition-colors">
                  Вход
                </button>
                <button onClick={() => { setIsRegisterModalOpen(true); setMobileMenuOpen(false); }} className="w-full px-4 py-2 bg-[#4100FA] text-white rounded-md hover:bg-[#3500D0] transition-colors">
                  Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Модальное окно входа */}
      {showLogin && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4 z-50">
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label htmlFor="login-username" className="block text-sm font-medium mb-1">Логин</label>
              <input
                type="text"
                id="login-username"
                name="login"
                value={loginData.login}
                onChange={handleLoginChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="login-password" className="block text-sm font-medium mb-1">Пароль</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Войти
            </button>
          </form>
        </div>
      )}
      {/* Модальное окно регистрации */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </header>
  );
}