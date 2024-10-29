"use client";

import "./globals.css";
import { AuthProvider } from 'contexts/AuthContext';
import Header from 'components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <AuthProvider>
        <body>
          <Header />
          <main>
            <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">{children}</div>
          </main>
        </body>
      </AuthProvider>
    </html>
  );
}
