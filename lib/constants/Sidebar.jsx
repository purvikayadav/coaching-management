"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, BookOpen, GraduationCap, BarChart3, LogOut, User, CircleUserRound } from "lucide-react";
import { ROUTES_PATH } from "../constants/routePaths";
import { signOut } from "firebase/auth";
import { auth } from "../../app/firebaseConfig";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserEmail(user.email);
      else setUserEmail("");
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col justify-between border-r">
      {/* Top Section */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-6 text-blue-600 text-center">
          VKG
        </h2>

        <nav className="space-y-2">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
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
      <div className="p-4 border-t flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <CircleUserRound size={44}  className="w-6 h-6 text-gray-600" />
          <span className="text-sm text-gray-800 truncate">{userEmail}</span>
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
