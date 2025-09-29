"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, db } from "@utils/firebase";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user }: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const garagisteDoc = await getDoc(doc(db, "garagistes", user.uid));

      if (garagisteDoc.exists()) {
        router.push("/dashboard");
      } else {
        const clientDoc = await getDoc(doc(db, "clients", user.uid));
        if (clientDoc.exists()) {
          router.push("/customer");
        } else {
          setError("Utilisateur non trouvé dans la base de données.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError("Email ou mot de passe incorrect. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Chargement..." : "Se Connecter"}
              </Button>
            </CardFooter>
          </form>
          <CardFooter>
            <p className="w-full text-center text-sm text-gray-600">
              Pas de compte ?{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Inscrivez-vous ici
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
