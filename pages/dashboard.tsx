import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import RepairList from "../components/RepairList";
import AddRepairForm from "../components/AddRepairForm";
import useUserRole from "../hooks/useUserRole";
import Layout from "../components/Layout";

interface Repair {
  id: string;
  clientId: string;
  vehicleId: string;
  description: string;
  status: string;
}

const Dashboard = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const { role, loading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role === "Client") {
      router.push("/unauthorized");
    }
  }, [loading, role, router]);

  const fetchRepairs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Repairs"));
      const repairsData: Repair[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Repair[];
      setRepairs(repairsData);
    } catch (error) {
      console.error("Error fetching repairs:", error);
    }
  };

  useEffect(() => {
    if (role === "Garagiste") {
      fetchRepairs();
    }
  }, [role]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Layout>
      <h1>Dashboard - Réparations</h1>
      {role === "Garagiste" && (
        <>
          <AddRepairForm onRepairAdded={fetchRepairs} />
          <RepairList repairs={repairs} onStatusUpdated={fetchRepairs} />
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
