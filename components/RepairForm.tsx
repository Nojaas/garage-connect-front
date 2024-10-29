"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage, db } from '../utils/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

type RepairFormProps = {
  repair: {
    description: string;
    status: string;
    images?: string[];
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setRepair: React.Dispatch<React.SetStateAction<any>>;
  repairId: string;
};

export default function RepairForm({ repair, handleInputChange, setRepair, repairId }: RepairFormProps) {
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      const uploadedImageUrls: string[] = [];

      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `repairs/${repairId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Erreur lors du téléchargement :', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              uploadedImageUrls.push(downloadURL);
              resolve();
            }
          );
        });
      }

      setRepair((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImageUrls],
      }));

      if (uploadedImageUrls.length > 0) {
        const repairRef = doc(db, 'repairs', repairId);
        await updateDoc(repairRef, {
          images: [...(repair.images || []), ...uploadedImageUrls],
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des images :", error);
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      const updatedImages = repair.images?.filter((url) => url !== imageUrl) || [];

      const repairRef = doc(db, 'repairs', repairId);
      await updateDoc(repairRef, {
        images: updatedImages,
      });

      setRepair((prev: any) => ({
        ...prev,
        images: updatedImages,
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image :", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description de la Réparation</Label>
        <Input
          id="description"
          name="description"
          value={repair.description}
          onChange={handleInputChange}
          placeholder="Entrez la description de la réparation"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Statut de la Réparation</Label>
        <select
          id="status"
          name="status"
          value={repair.status}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="en attente">En Attente</option>
          <option value="en cours">En Cours</option>
          <option value="terminé">Terminé</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="images">Ajouter des Photos de la Réparation</Label>
        <Input
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleImageUpload(e.target.files)}
        />
      </div>
      {repair.images && repair.images.length > 0 && (
        <div className="space-y-2">
          <Label>Photos de la Réparation</Label>
          <div className="grid grid-cols-2 gap-4">
            {repair.images.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Repair Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded shadow-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleImageDelete(url)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
