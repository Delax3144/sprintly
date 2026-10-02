"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, LayoutDashboard, ListTodo, Layers2 } from "lucide-react";

const navigation = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "My Tasks", icon: ListTodo },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="shrink-0 border-b bg-surface p-4 md:w-60 md:border-r md:border-b-0 md:p-5">
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg">
                <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
                >
                    <Layers2 className="size-4" />
                </span>
                <span className="text-base font-semibold tracking-tight">Sprintly</span>
            </Link>

            <nav
                aria-label="Main navigation"
                className="mt-5 flex flex-wrap gap-2 md:flex-col"
            >
                {navigation.map((item) => {
                    const exact = pathname === item.href;
                    const active = exact || (
                        item.href !== "/" && pathname.startsWith(`${item.href}/`)
                    );

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={exact ? "page" : active ? "location" : undefined}
                            className={`flex min-h-9 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-accent-soft text-primary"
                                    : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className="hidden md:block"
                            >
                                <item.icon className="size-4" />
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
