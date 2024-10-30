"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NewCustomer from './NewCustomer';

type Client = {
  id?: string;
  name: string;
  email: string;
  phone: string;
};

type CustomersListProps = {
  clients: Client[];
};

export default function CustomersList({ clients }: CustomersListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleClientClick = (clientId?: string) => {
    if (clientId) {
      router.push(`/customers/${clientId}`);
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" aria-label="Retour sur le dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-5 w-5 mr-1" />
            </Button>
          </Link>
          <CardTitle>Clients</CardTitle>
        </div>
        <NewCustomer />
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Rechercher par nom, email ou téléphone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {filteredClients.length === 0 ? (
          <p>Aucun client trouvé.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
