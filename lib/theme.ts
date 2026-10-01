export type Theme = "light" | "dark";

const storageKey = "sprintly-theme";
const changeEvent = "sprintly-theme-change";

export const themeScript = `(() => {
    let theme;
    try { theme = localStorage.getItem("${storageKey}"); } catch {}
    if (theme !== "light" && theme !== "dark") {
        theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.dataset.theme = theme;
})();`;

export function getTheme(): Theme {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function getServerTheme(): Theme {
    return "light";
}

export function setTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;

    try {
        localStorage.setItem(storageKey, theme);
    } catch {
        // Переключение работает и при недоступном хранилище.
    }

    window.dispatchEvent(new Event(changeEvent));
}

export function subscribeToTheme(onChange: () => void) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function syncPreference() {
        let saved: string | null = null;

        try {
            saved = localStorage.getItem(storageKey);
        } catch {
            // Используем системную тему, если выбор нельзя прочитать.
        }

        document.documentElement.dataset.theme =
            saved === "light" || saved === "dark"
                ? saved
                : media.matches ? "dark" : "light";
        onChange();
    }

    function handleStorage(event: StorageEvent) {
        if (event.key === storageKey || event.key === null) {
            syncPreference();
        }
    }

    syncPreference();
    window.addEventListener(changeEvent, onChange);
    window.addEventListener("storage", handleStorage);
    media.addEventListener("change", syncPreference);

    return () => {
        window.removeEventListener(changeEvent, onChange);
        window.removeEventListener("storage", handleStorage);
        media.removeEventListener("change", syncPreference);
    };
}
