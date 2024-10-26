import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "utils/firebaseConfig";
import Layout from "../components/Layout";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("Client");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        role: role,
      });

      alert("Registration successful");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Failed to register");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Client">Client</option>
            <option value="Garagiste">Garagiste</option>
          </select>
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Register
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
