"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmationDialog({ isOpen, onOpenChange, handleDelete, itemName }: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            {itemName ? (
              <>Êtes-vous sûr de vouloir supprimer <strong>{itemName}</strong> ? Cette action est irréversible.</>
            ) : (
              <>Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.</>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DeleteConfirmationDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  handleDelete: () => void;
  itemName?: string;
};
