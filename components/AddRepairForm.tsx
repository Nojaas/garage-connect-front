import { FC, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "utils/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

interface AddRepairFormProps {
  onRepairAdded: () => void;
}

// Déclare un type pour représenter un Client
interface Client {
  id: string;
  email: string;
}

interface CreateRepairResponse {
  message: string;
}

const AddRepairForm: FC<AddRepairFormProps> = ({ onRepairAdded }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("en attente");

  const auth = getAuth();
  const functions = getFunctions();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Récupérer les utilisateurs ayant le rôle "Client"
        const clientsQuery = query(collection(db, "Users"), where("role", "==", "Client"));
        const querySnapshot = await getDocs(clientsQuery);
        const clientsData: Client[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          email: doc.data().email,
        }));
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleAddRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedClientId) {
        alert("Please select a client.");
        return;
      }

      // Utiliser la fonction callable pour créer la réparation
      const createRepair = httpsCallable<any, CreateRepairResponse>(functions, "createRepair");
      const result = await createRepair({
        clientId: selectedClientId,
        vehicleId,
        description,
        status,
      });

      alert(result.data.message);
      setSelectedClientId("");
      setVehicleId("");
      setDescription("");
      setStatus("en attente");
      onRepairAdded(); // Notify parent component
    } catch (error) {
      console.error("Error adding repair:", error);
      alert("Failed to add repair");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Ajouter une Réparation</h2>
      <form onSubmit={handleAddRepair} className="space-y-4">
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Sélectionner un client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.email}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Vehicle ID"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="en attente">En attente</option>
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
        </select>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          Ajouter Réparation
        </button>
      </form>
    </div>
  );
};

export default AddRepairForm;
