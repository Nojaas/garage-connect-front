"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@utils/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import RepairList from 'components/RepairList';
import { useAuth } from '@contexts/AuthContext';

interface Repair {
  id: string;
  description: string;
  vehicleId: string;
  clientId: string;
  startDate: any; 
  status: string;
  garageId: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
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

    setLoading(true);

    const repairsQuery = query(collection(db, 'repairs'), where('garageId', '==', user.uid));
    const unsubscribeRepairs = onSnapshot(repairsQuery, (snapshot) => {
      setRepairs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Repair)));
      setLoading(false);
    }, (error) => {
      console.error("Erreur lors de la récupération des réparations :", error);
      setLoading(false);
    });

    const vehiclesQuery = query(collection(db, 'vehicles'), where('garageId', '==', user.uid));
    const unsubscribeVehicles = onSnapshot(vehiclesQuery, (snapshot) => {
      setVehicles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle)));
    });

    const clientsQuery = query(collection(db, 'clients'), where('garageId', '==', user.uid));
    const unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
    });

    return () => {
      unsubscribeRepairs();
      unsubscribeVehicles();
      unsubscribeClients();
    };
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
