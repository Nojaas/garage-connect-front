"use client";

import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import NewRepair from './NewRepair';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type Repair = {
  id: string;
  description: string;
  vehicleId: string;
  clientId: string;
  startDate: any; 
  status: string;
};

type Vehicle = {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
};

type RepairListProps = {
  repairs: Repair[];
  vehicles: Vehicle[];
  clients: Client[];
  loading: boolean;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function RepairList({
  repairs,
  vehicles,
  clients,
  loading,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}: RepairListProps) {
  const router = useRouter();

  const getVehicleDetails = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}` : 'Véhicule non trouvé';
  };

  const getClientDetails = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? `${client.name} - ${client.email}` : 'Client non trouvé';
  };

  const filteredRepairs = repairs.filter((repair) => {
    const matchesStatus = statusFilter === 'All' || repair.status === statusFilter;
    const matchesSearch =
      getVehicleDetails(repair.vehicleId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientDetails(repair.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Button>
          <h1 className="text-2xl font-bold">Liste des Réparations</h1>
        </div>
        <NewRepair />
      </div>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Rechercher par véhicule ou client"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Tous</SelectItem>
            <SelectItem value="en attente">En Attente</SelectItem>
            <SelectItem value="en cours">En Cours</SelectItem>
            <SelectItem value="terminé">Terminé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {filteredRepairs.length === 0 ? (
        <p>Aucune réparation trouvée.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRepairs.map((repair) => (
              <TableRow
                key={repair.id}
                onClick={() => router.push(`/repairs/${repair.id}`)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell>{repair.description}</TableCell>
                <TableCell>{getVehicleDetails(repair.vehicleId)}</TableCell>
                <TableCell>{getClientDetails(repair.clientId)}</TableCell>
                <TableCell>{repair.startDate?.toDate().toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      repair.status === 'en attente'
                        ? 'bg-yellow-500'
                        : repair.status === 'en cours'
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {repair.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
