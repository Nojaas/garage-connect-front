"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../utils/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from 'lucide-react';
import RepairForm from 'components/RepairForm';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import NotificationMessage from 'components/NotificationMessage';

type Repair = {
  description: string;
  status: string;
  images?: string[];
};

export default function RepairDetailPage() {
  const params = useParams();
  const repairId = Array.isArray(params.repairId) ? params.repairId[0] : params.repairId;
  const { user, loading: authLoading } = useAuth();
  const [repair, setRepair] = useState<Repair>({ description: '', status: 'en attente', images: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchRepair = async () => {
      if (!user || typeof repairId !== 'string') return;

      try {
        const repairRef = doc(db, 'repairs', repairId);
        const repairSnapshot = await getDoc(repairRef);
        if (repairSnapshot.exists()) {
          const repairData = repairSnapshot.data() as Repair;
          setRepair(repairData);
        } else {
          setMessage({ type: 'error', content: 'Réparation non trouvée' });
          router.push('/repairs');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la réparation :", error);
        setMessage({ type: 'error', content: 'Une erreur est survenue lors de la récupération de la réparation.' });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRepair();
    }
  }, [repairId, user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRepair((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairId) return;

    try {
      const repairRef = doc(db, 'repairs', repairId);
      await updateDoc(repairRef, {
        description: repair.description,
        status: repair.status,
        images: repair.images ?? [],
      });
      setMessage({ type: 'success', content: 'Réparation mise à jour avec succès' });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réparation :", error);
      setMessage({ type: 'error', content: 'Une erreur est survenue lors de la mise à jour. Veuillez réessayer.' });
    }
  };

  const handleDelete = async () => {
    if (!repairId) return;

    try {
      const repairRef = doc(db, 'repairs', repairId);
      await deleteDoc(repairRef);
      setMessage({ type: 'success', content: 'Réparation supprimée avec succès' });
      setTimeout(() => {
        router.push('/repairs');
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la suppression de la réparation :", error);
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
          <Button variant="ghost" onClick={() => router.push('/repairs')}>
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Button>
          <CardTitle>Détails de la Réparation</CardTitle>
        </div>
      </CardHeader>
      <NotificationMessage message={message} />
      <RepairForm repair={repair} handleInputChange={handleInputChange} setRepair={setRepair} repairId={repairId as string} />
      <CardFooter className="flex justify-between">
        <DeleteConfirmationDialog itemName="cette réparation" isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} handleDelete={handleDelete} />
        <Button onClick={handleUpdate}>
          <Save className="mr-2 h-4 w-4" />
          Mettre à Jour
        </Button>
      </CardFooter>
    </Card>
  );
}
