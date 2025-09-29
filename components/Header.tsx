"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { Car, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "utils/firebase";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const excludedPaths = ["/login", "/signup"];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Car className="h-6 w-6 text-gray-900 dark:text-gray-100" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Garage Connect
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {pathname === "/" ? (
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          ) : (
            !excludedPaths.includes(pathname) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
