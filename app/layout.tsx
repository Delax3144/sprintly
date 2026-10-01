import type { Metadata } from "next";
import StoreProvider from "./StoreProvider";
import { themeScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
    title: "Sprintly",
    description: "Project management application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className="h-full antialiased" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="flex min-h-full flex-col">
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    );
}
