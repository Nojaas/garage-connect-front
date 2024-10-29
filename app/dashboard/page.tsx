"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Wrench, Car, ChevronDown } from "lucide-react";
import GarageChat from 'components/GarageChat';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [clientCount, setClientCount] = useState<number>(0);
  const [repairCount, setRepairCount] = useState<number>(0);
  const [vehicleCount, setVehicleCount] = useState<number>(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchCounts(user.uid);
    }
  }, [user, loading, router]);

  const fetchCounts = async (garageId: string) => {
    try {
      const clientsQuery = query(collection(db, 'clients'), where('garageId', '==', garageId));
      const repairsQuery = query(collection(db, 'repairs'), where('garageId', '==', garageId), where('status', 'in', ['en cours', 'en attente']));
      const vehiclesQuery = query(collection(db, 'vehicles'), where('garageId', '==', garageId));

      const [clientSnapshot, repairSnapshot, vehicleSnapshot] = await Promise.all([
        getDocs(clientsQuery),
        getDocs(repairsQuery),
        getDocs(vehiclesQuery),
      ]);

      setClientCount(clientSnapshot.size);
      setRepairCount(repairSnapshot.size);
      setVehicleCount(vehicleSnapshot.size);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/customers">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientCount}</div>
              <p className="text-xs text-muted-foreground">Total des clients enregistrés</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/repairs">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réparations Actives</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{repairCount}</div>
              <p className="text-xs text-muted-foreground">Réparations en cours</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vehicles">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Véhicules enregistrés</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicleCount}</div>
              <p className="text-xs text-muted-foreground">Total des véhicules enregistrés</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Activité récente</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Aujourd'hui</span>
            <Button variant="outline" size="sm">
              Voir plus
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {[
              { action: "Nouveau client enregistré", time: "il y a 2 heures" },
              { action: "Réparation d'un véhicule: Toyota Camry", time: "il y a 4 heures" },
              { action: "Réparation terminée: Honda Civic", time: "il y a 6 heures" },
            ].map((item, index) => (
              <li key={index} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarFallback>{item.action[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <GarageChat garageId={user?.uid} />
      </div>
    </main>
  );
}
