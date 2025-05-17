'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from '@/providers/query-client-provider';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {children}
            <Toaster />
          </>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}