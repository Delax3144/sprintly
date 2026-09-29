"use client";

import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    let title = "Dashboard";

    if (pathname === "/projects") {
        title = "Projects";
    } else if (pathname === "/tasks") {
        title = "My Tasks";
    }

    return (
    <header className="flex items-center justify-between border-b p-4">
        <h1>{title}</h1>
        <p>User</p>
    </header>
    );
}