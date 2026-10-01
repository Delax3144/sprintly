import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

type DashboardLayoutProps = {
    children: React.ReactNode;
};

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="min-w-0 flex-1">
                <Header />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
