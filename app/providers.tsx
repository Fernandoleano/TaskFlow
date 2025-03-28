'use client';

import { LanguageProvider } from './contexts/LanguageContext';
import AuthProvider from './components/providers/AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
} 