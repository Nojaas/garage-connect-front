import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CustomerForm({ customer, handleInputChange }: CustomerFormProps) {
  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          name="name"
          value={customer.name}
          onChange={handleInputChange}
          placeholder="Entrez le nom du client"
          required
          aria-label="Nom du client"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={customer.email}
          onChange={handleInputChange}
          placeholder="Entrez l'email du client"
          required
          aria-label="Email du client"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={customer.phone}
          onChange={handleInputChange}
          placeholder="Entrez le téléphone du client"
          required
          aria-label="Téléphone du client"
        />
      </div>
    </CardContent>
  );
}

type CustomerFormProps = {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
