"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  LogOut,
} from "lucide-react";
import { ROUTES_PATH } from "../constants/routePaths";
import { signOut } from "firebase/auth";
import { auth, db } from "../../app/firebaseConfig";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

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
  const [profileImage, setProfileImage] = useState(""); // ✅ store profile image

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);

        // ✅ Fetch profile image from Firestore
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileImage(data.photoURL || ""); // fallback to empty string
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      } else {
        setUserEmail("");
        setProfileImage("");
      }
    });

    return () => unsubscribe();
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
        {/* Profile Image or Fallback Icon */}
        <div
          onClick={goToProfile}
          className="flex items-center gap-2 p-2 rounded-lg hover:text-blue-600 cursor-pointer transition hover:underline"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-blue-400"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">👤</span>
            </div>
          )}
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
