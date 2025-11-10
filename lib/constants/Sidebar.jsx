"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BookOpen, GraduationCap, BarChart3 } from "lucide-react";
import { ROUTES_PATH } from "../constants/routePaths";

const sidebarLinks = [
  { name: "Students", href: ROUTES_PATH.STUDENTS, icon: Users },
  { name: "Classes", href: ROUTES_PATH.CLASSES, icon: GraduationCap },
  { name: "Tests", href: ROUTES_PATH.TESTS, icon: BookOpen },
  { name: "Results", href: ROUTES_PATH.RESULTS, icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-white shadow-md flex flex-col p-4 border-r">
      <h2 className="text-xl font-semibold mb-6 text-blue-600 text-center">
        VKG
      </h2>

      <nav className="space-y-2">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);

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
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
