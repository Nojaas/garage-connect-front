"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import ClientRepairsList from 'components/CustomerRepairsList';
import CustomerChat from 'components/CustomerChat';

export default function CustomerPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [garageId, setGarageId] = useState<string>('');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchCustomerData(user.uid);
      fetchVehicles(user.uid);
    }
  }, [user, authLoading, router]);

  const fetchCustomerData = async (clientId: string) => {
    try {
      const clientDoc = await getDoc(doc(db, 'clients', clientId));
      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        setCustomerName(clientData.name);
        setGarageId(clientData.garageId); // Récupérer l'ID du garage
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du client :", error);
    }
  };

  const fetchVehicles = async (clientId: string) => {
    try {
      const vehiclesQuery = query(collection(db, 'vehicles'), where('clientId', '==', clientId));
      const vehiclesSnapshot = await getDocs(vehiclesQuery);
      const vehiclesData = vehiclesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVehicles(vehiclesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules :", error);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <ClientRepairsList vehicles={vehicles} customerName={customerName} />
      {garageId && <CustomerChat garageId={garageId} />} {/* Intégration du composant CustomerChat */}
    </div>
  );
}
