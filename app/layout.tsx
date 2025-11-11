import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // <-- THE MOST IMPORTANT LINE
import { AuthProvider } from '@/../context/AuthContext';
import { CartProvider } from '@/../context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/../components/Navbar';
import Footer from '@/../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nafay - Premium Laptop Store',
  description: 'Find the best laptops for your needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}