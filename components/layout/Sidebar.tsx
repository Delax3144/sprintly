"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="shrink-0 border-b p-4 md:w-60 md:border-r md:border-b-0">
            <h2>Sprintly</h2>

            <nav aria-label="Main navigation" className="mt-4 flex flex-wrap gap-3 md:flex-col md:gap-2">
                <Link
                    href="/"
                    aria-current={pathname === "/" ? "page" : undefined}
                    className={`transition-colors duration-200 hover:text-blue-300 ${
                        pathname === "/" ? "text-blue-500" : ""
                    }`}
                >
                    Dashboard
                </Link>
                <Link
                    href="/projects"
                    aria-current={
                        pathname === "/projects"
                            ? "page"
                            : pathname.startsWith("/projects/")
                                ? "location"
                                : undefined
                    }
                    className={`transition-colors duration-200 hover:text-blue-300 ${
                        pathname === "/projects" || pathname.startsWith("/projects/")
                            ? "text-blue-500"
                            : ""
                    }`}
                >
                    Projects
                </Link>
                <Link
                    href="/tasks"
                    aria-current={pathname === "/tasks" ? "page" : undefined}
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
