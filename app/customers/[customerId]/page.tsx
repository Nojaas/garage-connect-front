"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@utils/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from 'lucide-react';
import CustomerForm from '@components/CustomerForm';
import DeleteConfirmationDialog from '@components/DeleteConfirmationDialog';
import NotificationMessage from '@components/NotificationMessage';

type Customer = {
  name: string;
  email: string;
  phone: string;
};

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [customer, setCustomer] = useState<Customer>({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchCustomer();
    }
  }, [customerId, user]);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const customerRef = doc(db, 'clients', customerId as string);
      const customerSnapshot = await getDoc(customerRef);
      if (customerSnapshot.exists()) {
        setCustomer(customerSnapshot.data() as Customer);
      } else {
        setMessage({ type: 'error', content: 'Client non trouvé' });
        router.push('/customers');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du client :", error);
      setMessage({ type: 'error', content: 'Une erreur est survenue lors de la récupération du client.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev: Customer) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const customerRef = doc(db, 'clients', customerId as string);
      await updateDoc(customerRef, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
      setMessage({ type: 'success', content: 'Client mis à jour avec succès' });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client :", error);
      setMessage({ type: 'error', content: 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.' });
    }
  };

  const handleDelete = async () => {
    try {
      const customerRef = doc(db, 'clients', customerId as string);
      await deleteDoc(customerRef);
      setMessage({ type: 'success', content: 'Client supprimé avec succès' });
      setTimeout(() => {
        router.push('/customers');
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      setMessage({ type: 'error', content: 'Une erreur est survenue lors de la suppression. Veuillez réessayer.' });
    }
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Link href="/customers" aria-label="Retour à la liste des clients">
            <Button variant="ghost">
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button>
          </Link>
          <CardTitle>Détails du Client</CardTitle>
        </div>
      </CardHeader>
      <NotificationMessage message={message} />
      <CustomerForm customer={customer} handleInputChange={handleInputChange} />
      <CardFooter className="flex justify-between">
        <DeleteConfirmationDialog itemName="ce client" isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} handleDelete={handleDelete} />
        <Button onClick={handleUpdate}>
          <Save className="mr-2 h-4 w-4" />
          Mettre à Jour
        </Button>
      </CardFooter>
    </Card>
  );
}
