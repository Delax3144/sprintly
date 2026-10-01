import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Link from "next/link";

type DashboardLayoutProps = {
    children: React.ReactNode;
};

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Link
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3"
            >
                Skip to content
            </Link>
            <Sidebar />

            <div className="min-w-0 flex-1">
                <Header />
                <main id="main-content" tabIndex={-1} className="p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
