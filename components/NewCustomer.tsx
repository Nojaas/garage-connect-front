"use client";

import { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { auth, db } from '@utils/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
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
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const { user } = useAuth();

  const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      setPhoneError(null); 
    }
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

      let phone = formData.phone.trim();
      if (phone && !phone.startsWith('+')) {
        phone = '+33' + phone;
      }

      if (phone.length < 10) {
        setPhoneError("Le numéro de téléphone est trop court. Veuillez vérifier et réessayer.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_CREATE_CUSTOMER_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: tempPassword,
          name: formData.name,
          phone,
          garageId: user.uid,
        }),
      });

      if (response.ok) {
        await sendPasswordResetEmail(auth, formData.email);
      } else {
        throw new Error('Erreur lors de la création du client');
      }

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
              {field === 'phone' && phoneError && (
                <p className="text-red-500 text-sm mt-1">{phoneError}</p>
              )}
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
