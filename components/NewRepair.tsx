"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@contexts/AuthContext';
import { db } from '@utils/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Client = {
  id: string;
  name: string;
  email: string;
};

type Vehicle = {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  clientId: string;
};

export default function NewRepair() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [clientId, setClientId] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClientsAndVehicles(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (clientId) {
      setFilteredVehicles(vehicles.filter(vehicle => vehicle.clientId === clientId));
    } else {
      setFilteredVehicles([]);
    }
  }, [clientId, vehicles]);

  const fetchClientsAndVehicles = async (garageId: string) => {
    try {
      // Obtenir les clients liés au garagiste connecté
      const clientSnapshot = await getDocs(query(collection(db, 'clients'), where('garageId', '==', garageId)));
      setClients(clientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));

      // Obtenir les véhicules liés au garagiste connecté
      const vehicleSnapshot = await getDocs(query(collection(db, 'vehicles'), where('garageId', '==', garageId)));
      setVehicles(vehicleSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle)));
    } catch (error) {
      console.error("Erreur lors de la récupération des clients ou des véhicules :", error);
    }
  };

  const handleCreateRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'repairs'), {
        garageId: user.uid,
        clientId,
        vehicleId,
        description,
        status: 'en attente',
        startDate: new Date(),
        endDate: null,
        createdAt: new Date(),
        images: [],
      });
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création de la réparation :", error);
      alert("Une erreur est survenue lors de la création de la réparation. Veuillez réessayer.");
    }
  };

  const resetForm = () => {
    setClientId('');
    setVehicleId('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter une Réparation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Réparation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateRepair} className="space-y-4">
          <div>
            <Label htmlFor="client">Sélectionner un Client</Label>
            <select
              id="client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>Sélectionnez un client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="vehicle">Sélectionner un Véhicule</Label>
            <select
              id="vehicle"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>Sélectionnez un véhicule</option>
              {filteredVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-2">Vous ne trouvez pas de véhicule ?</p>
            <Link href="/vehicles">
              <p className="text-blue-500 text-sm hover:underline">Ajoutez un nouveau véhicule ici</p>
            </Link>
          </div>
          <div>
            <Label htmlFor="description">Description de la Réparation</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Créer la Réparation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
