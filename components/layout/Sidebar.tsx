"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { href: "/", label: "Dashboard", symbol: "D" },
    { href: "/projects", label: "Projects", symbol: "P" },
    { href: "/tasks", label: "My Tasks", symbol: "T" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="shrink-0 border-b bg-surface p-4 md:w-60 md:border-r md:border-b-0 md:p-5">
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg">
                <span
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white"
                >
                    S
                </span>
                <span className="text-lg font-bold tracking-tight">Sprintly</span>
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
                            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-accent-soft text-accent"
                                    : "text-muted hover:bg-surface-hover hover:text-foreground"
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className="hidden size-6 items-center justify-center rounded-md border text-xs md:flex"
                            >
                                {item.symbol}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
