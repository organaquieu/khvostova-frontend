import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '@/components/shared/header';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/context/UserContext';
import { ScrollHandler } from '@/components/shared/ScrollHandler';
import { CartProvider } from '@/context/CartContext';
import { Suspense } from 'react';
import QueryProvider from '@/providers/QueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ХВОСТОВА",
  description: "Каталог дизайнерской одежды",
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </CartProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Для стандартной favicon */}
      <link rel="icon" href="/xicon.png" type="image/png" />
        
        {/* Для разных размеров и устройств (опционально)
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /> */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Providers>
            <Suspense fallback={<div>Loading...</div>}>
              <Header />
              <ScrollHandler />
              {children}
              <Toaster position="top-center" />
            </Suspense>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}



// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="ru">
//       <body>
//         <Header />
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }

