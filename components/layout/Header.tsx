"use client";

import { usePathname } from "next/navigation";

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
        <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
            <p>{title}</p>
            <p>User</p>
        </header>
    );
}
