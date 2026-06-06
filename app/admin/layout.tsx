import type { ReactNode } from 'react';
import { PasswordGate } from '@/components/admin/PasswordGate';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <PasswordGate>
      <AdminLayout>{children}</AdminLayout>
    </PasswordGate>
  );
}
