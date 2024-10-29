"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../utils/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import VehiclesList from 'components/VehiclesList';

interface Vehicle {
  id?: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  clientId: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchVehicles(user.uid);
    }
  }, [user, loading, router]);

  const fetchVehicles = (garageId: string) => {
    const q = query(collection(db, 'vehicles'), where('garageId', '==', garageId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const vehiclesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Vehicle));
      setVehicles(vehiclesData);
    });

    return unsubscribe;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-16">
      <VehiclesList
        vehicles={filteredVehicles}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
