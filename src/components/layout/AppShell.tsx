import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header } from './Header';

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="text-center text-xs text-gray-400 py-2 pb-18 md:pb-2">
          Développé par Jérémy ROPAULD — 2026
        </footer>
      </div>
      <MobileNav />
    </div>
  );
}
