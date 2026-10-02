"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const Icon = theme === "dark" ? Sun : Moon;

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <Icon aria-hidden="true" />
            {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
    );
}
