'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/admin/questions', label: '❓ Perguntas', icon: '❓' },
  { href: '/admin/sponsors', label: '🏢 Patrocinadores', icon: '🏢' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900/80 border-b border-yellow-500/30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎪</span>
          <div>
            <h1 className="text-yellow-400 font-black text-lg leading-none">Pau de Sebo Cultural</h1>
            <p className="text-blue-400 text-xs">Painel Administrativo</p>
          </div>
        </div>
        <Link
          href="/"
          className="text-sm text-blue-300 hover:text-yellow-400 transition-colors border border-blue-600 hover:border-yellow-500/50 rounded-lg px-3 py-1.5"
        >
          ← Voltar ao jogo
        </Link>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="w-56 bg-blue-900/50 border-r border-blue-800 p-4 space-y-2 flex-shrink-0">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  active
                    ? 'bg-yellow-400 text-blue-900'
                    : 'text-blue-300 hover:bg-blue-800 hover:text-yellow-400'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
