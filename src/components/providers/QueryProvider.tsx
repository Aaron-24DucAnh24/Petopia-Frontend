'use client';
import { useState } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';

export function QueryProvider<T extends {}>(Children: (props: T) => JSX.Element) {
  const Wrapper = (props: T) => {
    const [queryClient] = useState(() => new QueryClient());
    return (
      <QueryClientProvider client={queryClient}>
        <Children {...props} />
      </QueryClientProvider>
    );
  };
  return Wrapper;
}