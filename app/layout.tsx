import type { Metadata } from "next";
import StoreProvider from "./StoreProvider";
import "./globals.css";

export const metadata: Metadata = {
    title: "Sprintly",
    description: "Project management application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className="h-full antialiased">
            <body className="flex min-h-full flex-col">
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    );
}
