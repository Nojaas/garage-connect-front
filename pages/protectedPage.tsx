import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "utils/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <div>Welcome to the protected page!</div>;
}
