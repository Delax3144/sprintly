"use client";

import { useGetDashboardSummaryQuery } from "@/lib/services/projectsApi";

export default function DashboardPage() {
    const {
        data: summary,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetDashboardSummaryQuery();

    if (isLoading) {
        return <p>Loading dashboard...</p>;
    }

    if (error) {
        return (
            <div className="space-y-3">
                <p role="alert">Could not load dashboard.</p>
                <button
                    type="button"
                    onClick={() => void refetch()}
                    disabled={isFetching}
                    className="rounded-lg border px-4 py-2 disabled:opacity-50"
                >
                    {isFetching ? "Loading..." : "Retry"}
                </button>
            </div>
        );
    }

    if (!summary) {
        return <p>No dashboard data.</p>;
    }

    const cards = [
        { label: "Projects", count: summary.projectsCount },
        { label: "Tasks", count: summary.tasksCount },
        { label: "Todo", count: summary.todoCount },
        { label: "In progress", count: summary.inProgressCount },
        { label: "Done", count: summary.doneCount },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {cards.map((card) => (
                    <div key={card.label} className="rounded-xl border bg-surface p-5 shadow-sm">
                        <dt className="text-sm">{card.label}</dt>
                        <dd className="mt-2 text-3xl font-semibold">
                            {card.count}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}