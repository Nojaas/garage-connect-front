"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../utils/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from 'lucide-react';
import VehicleForm from 'components/VehicleForm';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import NotificationMessage from 'components/NotificationMessage';

type Vehicle = {
  licensePlate: string;
  make: string;
  model: string;
  year: number;
};

type Message = {
  type: 'success' | 'error';
  content: string;
};

export default function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle>({ licensePlate: '', make: '', model: '', year: 0 });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchVehicle();
      }
    }
  }, [user, authLoading, router]);

  const fetchVehicle = async () => {
    try {
      const vehicleRef = doc(db, 'vehicles', vehicleId as string);
      const vehicleSnapshot = await getDoc(vehicleRef);
      if (vehicleSnapshot.exists()) {
        const vehicleData = vehicleSnapshot.data() as Vehicle;
        setVehicle(vehicleData);
      } else {
        console.error('Vehicle not found');
        setMessage({ type: 'error', content: 'Véhicule non trouvé' });
        router.push('/vehicles');
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du véhicule :", error);
      setMessage({ type: 'error', content: 'Une erreur est survenue lors de la récupération du véhicule.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vehicleRef = doc(db, 'vehicles', vehicleId as string);
      await updateDoc(vehicleRef, vehicle);
      setMessage({ type: 'success', content: 'Véhicule mis à jour avec succès' });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du véhicule :", error);
      setMessage({ type: 'error', content: 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.' });
    }
  };

  const handleDelete = async () => {
    try {
      const vehicleRef = doc(db, 'vehicles', vehicleId as string);
      await deleteDoc(vehicleRef);
      setMessage({ type: 'success', content: 'Véhicule supprimé avec succès' });
      setTimeout(() => {
        router.push('/vehicles');
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule :", error);
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
          <Button variant="ghost" onClick={() => router.push('/vehicles')}>
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Button>
          <CardTitle>Détails du Véhicule</CardTitle>
        </div>
      </CardHeader>
      <NotificationMessage message={message} />
      <VehicleForm vehicle={vehicle} handleInputChange={handleInputChange} />
      <CardFooter className="flex justify-between">
        <DeleteConfirmationDialog itemName="ce véhicule" isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} handleDelete={handleDelete} />
        <Button onClick={handleUpdate}>
          <Save className="mr-2 h-4 w-4" />
          Mettre à Jour
        </Button>
      </CardFooter>
    </Card>
  );
}
