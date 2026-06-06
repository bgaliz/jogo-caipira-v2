import type { Metadata } from 'next';
import { Baloo_2 } from 'next/font/google';
import './globals.css';

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Pau de Sebo Cultural — Festa Junina',
  description: 'Jogo de perguntas e respostas da Festa Junina',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${baloo.variable} h-full`}>
      <body className="h-full bg-blue-950 font-baloo antialiased">{children}</body>
    </html>
  );
}
