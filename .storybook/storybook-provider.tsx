'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { AppToastViewport, Toaster } from '@/components/common/Toast';

function createStorybookQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
}

export function StorybookProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createStorybookQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background p-6 text-foreground">
        {children}
      </div>
      <Toaster richColors closeButton position="top-right" />
      <AppToastViewport />
    </QueryClientProvider>
  );
}
