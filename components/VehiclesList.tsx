"use client";

import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NewVehicle from './NewVehicle';

export default function VehiclesList({ vehicles, searchTerm, setSearchTerm }: VehiclesListProps) {
  const router = useRouter();

  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}`);
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Button>
          <CardTitle>Véhicules</CardTitle>
        </div>
        <NewVehicle />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Rechercher par immatriculation, marque ou modèle"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {filteredVehicles.length === 0 ? (
          <p>Aucun véhicule trouvé.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead>Année</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id} onClick={() => handleVehicleClick(vehicle.id!)} className="cursor-pointer hover:bg-gray-100">
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

type Vehicle = {
  id?: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  clientId: string;
};

type VehiclesListProps = {
  vehicles: Vehicle[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};