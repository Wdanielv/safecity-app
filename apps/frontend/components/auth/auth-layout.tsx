import Link from 'next/link';
import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Link href="/" className="text-xl font-semibold tracking-tight">
        SAFECITY
      </Link>
      {children}
    </div>
  );
}
