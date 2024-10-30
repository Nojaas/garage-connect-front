"use client";

import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { db, auth } from '@utils/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();

  const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour créer une fiche client.");
      return;
    }

    try {
      setIsSubmitting(true);
      const tempPassword = generateRandomPassword();

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, tempPassword);
      const clientAuthUser = userCredential.user;

      await setDoc(doc(db, 'clients', clientAuthUser.uid), {
        clientId: clientAuthUser.uid,
        garageId: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'client',
        createdAt: new Date(),
      });

      await sendPasswordResetEmail(auth, formData.email);

      setFormData({ name: '', email: '', phone: '' });
      setIsOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création de la fiche client :", error);
      alert("Une erreur est survenue lors de la création de la fiche client. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un Client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Nouveau Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateClient} className="space-y-4">
          {['name', 'email', 'phone'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field === 'name' ? 'Nom' : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input
                id={field}
                name={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                value={formData[field as keyof typeof formData]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'En cours...' : 'Ajouter le Client'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
