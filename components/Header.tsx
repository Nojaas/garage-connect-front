import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";

const Header = () => {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-blue-600 p-4 text-white">
      <nav className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          GarageConnect
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            Dashboard
          </Link>
          <Link href="/login">
            Login
          </Link>
          <Link href="/register">
            Register
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded text-white"
          >
            Se Déconnecter
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
