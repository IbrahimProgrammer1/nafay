import Link from 'next/link';
import { ReactNode } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut } from 'lucide-react';
import Navbar from '@/../components/Navbar'; // We can reuse the main Navbar

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
          <Link href="/admin/dashboard">Nafay Admin</Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
            {/* You can add a logout button here if needed, but it's also in the top navbar */}
            <Link href="/" className="text-sm text-gray-400 hover:text-white">← Back to Store</Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b md:hidden">
            {/* Mobile-friendly top bar if needed, or just rely on main Navbar */}
            <Navbar />
        </header>
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}