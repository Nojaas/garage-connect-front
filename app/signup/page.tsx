"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@utils/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { email, password, name, phone, address } = formData;

      if (!email || !password || !name || !phone || !address) {
        throw new Error('Tous les champs doivent être remplis.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'garagistes', user.uid), {
        garageId: user.uid,
        name,
        email,
        phone,
        address,
        role: 'garagiste',
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error("Erreur lors de l'inscription :", error);
      setError(error.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inscription Garagiste</CardTitle>
          <CardContent className="mb-4">
            Entrez vos informations pour créer votre compte
          </CardContent>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            {['name', 'email', 'password', 'phone', 'address'].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{getLabel(field)}</Label>
                <Input
                  id={field}
                  name={field}
                  type={field === 'password' ? 'password' : field === 'phone' ? 'tel' : 'text'}
                  placeholder={getPlaceholder(field)}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
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
              {loading ? 'Chargement...' : 'S\'inscrire'}
            </Button>
          </CardFooter>
        </form>
        <CardFooter>
          <p className="w-full text-center text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Connectez-vous ici
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );

  function getLabel(field: string): string {
    switch (field) {
      case 'name': return 'Entreprise';
      case 'email': return 'Email';
      case 'password': return 'Mot de passe';
      case 'phone': return 'Téléphone';
      case 'address': return 'Adresse';
      default: return '';
    }
  }

  function getPlaceholder(field: string): string {
    switch (field) {
      case 'name': return 'Nom du garage';
      case 'email': return 'you@example.com';
      case 'phone': return 'Numéro de téléphone';
      case 'address': return 'Adresse du garage';
      default: return '';
    }
  }
}
