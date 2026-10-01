"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function Header() {
    const pathname = usePathname();

    let title = "Dashboard";

    if (pathname === "/projects") {
        title = "Projects";
    } else if (pathname.startsWith("/projects/")) {
        title = "Project details";
    } else if (pathname === "/tasks") {
        title = "My Tasks";
    }

    return (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-surface px-4 py-3 md:px-8">
            <p className="font-semibold">{title}</p>
            <ThemeToggle />
        </header>
    );
}
