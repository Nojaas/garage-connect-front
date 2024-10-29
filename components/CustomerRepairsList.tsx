"use client";

import { useState, useEffect } from 'react';
import { db } from '@utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface Repair {
  id: string;
  createdAt: {
    toDate: () => Date;
  };
  description: string;
  status: string;
  images?: string[];
}

interface ClientRepairsListProps {
  vehicles: Vehicle[];
  customerName: string;
}

export default function ClientRepairsList({ vehicles, customerName }: ClientRepairsListProps) {
  const [repairsMap, setRepairsMap] = useState<{ [vehicleId: string]: Repair[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const fetchRepairs = async () => {
      setLoading(true);
      try {
        const repairsMapTemp: { [vehicleId: string]: Repair[] } = {};

        const promises = vehicles.map(async (vehicle) => {
          const repairsQuery = query(collection(db, 'repairs'), where('vehicleId', '==', vehicle.id));
          const repairsSnapshot = await getDocs(repairsQuery);
          repairsMapTemp[vehicle.id] = repairsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Repair[];
        });

        await Promise.all(promises);
        setRepairsMap(repairsMapTemp);
      } catch (error) {
        console.error("Erreur lors de la récupération des réparations :", error);
      } finally {
        setLoading(false);
      }
    };

    if (vehicles.length > 0) {
      fetchRepairs();
    } else {
      setLoading(false);
    }
  }, [vehicles]);

  const getFilteredRepairs = (repairs: Repair[]) => {
    if (statusFilter === '') return repairs;
    return repairs.filter((repair) => repair.status === statusFilter);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenue, {customerName}</h1>
      {loading ? (
        <p className="text-gray-600">Chargement des réparations...</p>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-600">Aucun véhicule trouvé.</p>
      ) : (
        vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </span>
                <Badge variant="secondary">{vehicle.licensePlate}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {repairsMap[vehicle.id] && repairsMap[vehicle.id].length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredRepairs(repairsMap[vehicle.id]).map((repair) => (
                        <TableRow key={repair.id}>
                          <TableCell>{repair.createdAt?.toDate().toLocaleDateString()}</TableCell>
                          <TableCell>{repair.description}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={`px-2 py-1 rounded ${repair.status === 'en attente' ? 'bg-yellow-200 text-yellow-800' : repair.status === 'en cours' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                              {repair.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {getFilteredRepairs(repairsMap[vehicle.id]).map(
                    (repair) =>
                      repair.images && repair.images.length > 0 && (
                        <div key={repair.id} className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Photos de la Réparation</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {repair.images.map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Repair ${repair.id} Image ${index + 1}`}
                                className="w-32 h-32 object-cover rounded shadow-md"
                              />
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </>
              ) : (
                <p className="text-gray-600">Aucune réparation trouvée pour ce véhicule.</p>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}