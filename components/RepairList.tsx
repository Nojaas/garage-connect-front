import { FC } from "react";
import UpdateRepairStatus from "./UpdateRepairStatus";

interface Repair {
  id: string;
  clientId: string;
  vehicleId: string;
  description: string;
  status: string;
}

interface RepairListProps {
  repairs: Repair[];
  onStatusUpdated: () => void;
}

const RepairList: FC<RepairListProps> = ({ repairs, onStatusUpdated }) => {
  return (
    <div>
      <h2>Liste des Réparations</h2>
      <ul>
        {repairs.map((repair) => (
          <li key={repair.id}>
            <strong>Description :</strong> {repair.description} - <strong>Status :</strong> {repair.status}
            <UpdateRepairStatus repairId={repair.id} currentStatus={repair.status} onStatusUpdated={onStatusUpdated} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepairList;
