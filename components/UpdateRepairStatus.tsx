import { FC, useState } from "react";
import { db } from "utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

interface UpdateRepairStatusProps {
  repairId: string;
  currentStatus: string;
  onStatusUpdated: () => void;
}

const UpdateRepairStatus: FC<UpdateRepairStatusProps> = ({ repairId, currentStatus, onStatusUpdated }) => {
  const [status, setStatus] = useState<string>(currentStatus);

  const handleUpdateStatus = async () => {
    try {
      const repairRef = doc(db, "Repairs", repairId);
      await updateDoc(repairRef, {
        status: status,
        updatedAt: new Date(),
      });
      alert("Status updated successfully");
      onStatusUpdated(); // Notify parent component
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="en attente">En attente</option>
        <option value="en cours">En cours</option>
        <option value="terminé">Terminé</option>
      </select>
      <button onClick={handleUpdateStatus}>Mettre à jour le statut</button>
    </div>
  );
};

export default UpdateRepairStatus;
