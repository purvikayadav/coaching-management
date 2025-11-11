"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, BookOpen, GraduationCap, BarChart3, LogOut } from "lucide-react";
import { ROUTES_PATH } from "../constants/routePaths";
import { signOut } from "firebase/auth";
import { auth, db } from "../../app/firebaseConfig";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore"; // use onSnapshot for realtime updates

const sidebarLinks = [
  { name: "Students", href: ROUTES_PATH.DASHBOARD, icon: Users },
  { name: "Classes", href: ROUTES_PATH.CLASSES, icon: GraduationCap },
  { name: "Tests", href: ROUTES_PATH.TESTS, icon: BookOpen },
  { name: "Results", href: ROUTES_PATH.RESULTS, icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);

        // ✅ Realtime listener for user name from Firestore
        const userRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.name || "No Name");
          }
        });

        // cleanup snapshot listener
        return () => unsubscribeSnapshot();
      } else {
        setUserEmail("");
        setUserName("");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const goToProfile = () => {
    router.push(ROUTES_PATH.PROFILE);
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col justify-between border-r">
      {/* Top Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 text-blue-600 text-center">VKG</h2>

        <nav className="space-y-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t flex flex-col gap-2">
        <div
          onClick={goToProfile}
          className="flex items-center gap-2 p-2 rounded-lg hover:text-blue-600 cursor-pointer transition"
        >
          {/* ✅ Left corner user icon */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600">👤</span>
          </div>

          {/* Name and email */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 truncate">{userName}</span>
            <span className="text-xs text-gray-500 truncate">{userEmail}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
