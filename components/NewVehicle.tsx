"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@contexts/AuthContext';
import { auth, db } from '@utils/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Client = {
  id: string;
  clientId?: string;
  name?: string;
  email?: string;
};

export default function NewVehicle() {
  const { user, loading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, 'clients'), where('garageId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(clientsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    };

    fetchClients();
  }, [user]);

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Vous devez être connecté pour ajouter un véhicule.");
      router.push('/login');
      return;
    }

    try {
      const vehicleRef = doc(collection(db, 'vehicles'));
      await setDoc(vehicleRef, {
        vehicleId: vehicleRef.id,
        clientId,
        licensePlate,
        make,
        model,
        year: parseInt(year),
        garageId: user.uid,
        createdAt: new Date(),
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création du véhicule :", error);
      alert("Une erreur est survenue lors de la création du véhicule. Veuillez réessayer.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un Véhicule</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau Véhicule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateVehicle} className="space-y-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Sélectionner un Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>Sélectionnez un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.clientId}>{client.name} - {client.email}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Plaque d'immatriculation</label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Marque</label>
            <input
              type="text"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Modèle</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Année</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <Button type="submit">
            Ajouter le Véhicule
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
