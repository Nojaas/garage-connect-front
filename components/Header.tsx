"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from 'utils/firebase';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const excludedPaths = ['/login', '/signup'];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Garage Connect</h1>
        <div className="flex items-center space-x-4">
          {!excludedPaths.includes(pathname) && (
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Déconnexion">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
