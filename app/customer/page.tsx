"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@utils/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import CustomersList from 'components/CustomersList';

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export default function CustomersPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      const q = query(collection(db, 'clients'), where('garageId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const clientsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Client));
        setClients(clientsData);
      });

      return () => unsubscribe();
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <CustomersList clients={clients} />
    </div>
  );
}
