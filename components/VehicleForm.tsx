"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VehicleForm({ vehicle, handleInputChange }: VehicleFormProps) {
  return (
    <div className="p-4 space-y-4">
      {fields.map(({ id, label, type, placeholder }) => (
        <div key={id} className="space-y-2">
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            name={id}
            type={type}
            value={(vehicle as any)[id]}
            onChange={handleInputChange}
            placeholder={placeholder}
            required
          />
        </div>
      ))}
    </div>
  );
}

type Vehicle = {
  licensePlate: string;
  make: string;
  model: string;
  year: number | string;
};

type VehicleFormProps = {
  vehicle: Vehicle;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const fields = [
  {
    id: "licensePlate",
    label: "Plaque d'immatriculation",
    type: "text",
    placeholder: "Entrez la plaque d'immatriculation",
  },
  {
    id: "make",
    label: "Marque",
    type: "text",
    placeholder: "Entrez la marque du véhicule",
  },
  {
    id: "model",
    label: "Modèle",
    type: "text",
    placeholder: "Entrez le modèle du véhicule",
  },
  {
    id: "year",
    label: "Année",
    type: "number",
    placeholder: "Entrez l'année du véhicule",
  },
];
