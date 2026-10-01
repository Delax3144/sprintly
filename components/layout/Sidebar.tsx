"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r p-4">
      <h2>Sprintly</h2>

      <nav className="mt-4 flex flex-col gap-2">
        <Link
          href="/"
          className={`transition-colors duration-200 hover:text-blue-300 ${
            pathname === "/" ? "text-blue-500" : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/projects"
          className={`transition-colors duration-200 hover:text-blue-300 ${
            pathname === "/projects" ? "text-blue-500" : ""
          }`}
        >
          Projects
        </Link>
        <Link
          href="/tasks"
          className={`transition-colors duration-200 hover:text-blue-300 ${
            pathname === "/tasks" ? "text-blue-500" : ""
          }`}
        >
          My Tasks
        </Link>
      </nav>
    </aside>
  );
}
