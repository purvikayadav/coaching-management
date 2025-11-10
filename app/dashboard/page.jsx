"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-blue-600">
        Welcome to Dashboard 🎉
      </h1>
      <p className="text-gray-600 mt-2">
        Choose a section from the sidebar to manage Students, Classes, Tests, or
        Results.
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
