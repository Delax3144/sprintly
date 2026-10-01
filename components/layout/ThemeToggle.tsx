"use client";

import { useSyncExternalStore } from "react";
import {
    getServerTheme,
    getTheme,
    setTheme,
    subscribeToTheme,
} from "@/lib/theme";

export default function ThemeToggle() {
    const theme = useSyncExternalStore(
        subscribeToTheme,
        getTheme,
        getServerTheme
    );

    return (
        <button
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border bg-surface px-3 text-sm font-medium text-foreground hover:bg-surface-hover"
        >
            <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                {theme === "dark" ? (
                    <>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                    </>
                ) : (
                    <path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z" />
                )}
            </svg>
            {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
    );
}
