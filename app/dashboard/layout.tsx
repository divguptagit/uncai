'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import PageTransition from '../components/PageTransition';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
    return null;
  }

  return <PageTransition>{children}</PageTransition>;
}
