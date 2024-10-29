"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import RepairList from 'components/RepairList';
import { useAuth } from '@contexts/AuthContext';

interface Repair {
  id: string;
  description: string;
  status: string;
  garageId: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  garageId: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  garageId: string;
}

export default function RepairsPage() {
  const { user, loading: authLoading } = useAuth(); 
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const [repairsSnapshot, vehiclesSnapshot, clientsSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'repairs'), where('garageId', '==', user.uid))),
          getDocs(query(collection(db, 'vehicles'), where('garageId', '==', user.uid))),
          getDocs(query(collection(db, 'clients'), where('garageId', '==', user.uid))),
        ]);

        setRepairs(repairsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Repair)));
        setVehicles(vehiclesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle)));
        setClients(clientsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  return (
    <div className="p-16">
      <RepairList
        repairs={repairs}
        vehicles={vehicles}
        clients={clients}
        loading={loading}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}