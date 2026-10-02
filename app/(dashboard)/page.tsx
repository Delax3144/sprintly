"use client";

import Link from "next/link";
import { ArrowUpRight, FolderKanban, ListTodo, Circle, Clock3, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetDashboardSummaryQuery } from "@/lib/services/projectsApi";

export default function DashboardPage() {
    const { data: summary, isLoading, isFetching, error, refetch } = useGetDashboardSummaryQuery();

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;
    if (error) return (
        <div className="space-y-3">
            <p role="alert" className="text-sm text-destructive">Could not load dashboard.</p>
            <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>Retry</Button>
        </div>
    );
    if (!summary) return <p>No dashboard data.</p>;

    const cards = [
        { label: "Projects", count: summary.projectsCount, icon: FolderKanban, href: "/projects" },
        { label: "All tasks", count: summary.tasksCount, icon: ListTodo, href: "/tasks" },
        { label: "Todo", count: summary.todoCount, icon: Circle, href: "/tasks?status=todo" },
        { label: "In progress", count: summary.inProgressCount, icon: Clock3, href: "/tasks?status=in_progress" },
        { label: "Done", count: summary.doneCount, icon: CircleCheck, href: "/tasks?status=done" },
    ];
    const completion = summary.tasksCount ? Math.round(summary.doneCount / summary.tasksCount * 100) : 0;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="mt-2 text-sm text-muted-foreground">An overview of your projects and tasks.</p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {cards.map((card) => (
                    <div key={card.label} className="relative rounded-lg border bg-card p-5 shadow-xs">
                        <dt className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                            {card.label}<card.icon aria-hidden="true" className="size-4" />
                        </dt>
                        <dd className="mt-4 text-3xl font-semibold tracking-tight">{card.count}</dd>
                        <Link href={card.href} aria-label={`View ${card.label.toLowerCase()}`} className="mt-4 inline-flex items-center gap-1 rounded-sm text-xs text-muted-foreground hover:text-primary">
                            View <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        </Link>
                    </div>
                ))}
            </dl>
            <section className="rounded-lg border bg-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-semibold">Task progress</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{summary.tasksCount ? `${summary.doneCount} of ${summary.tasksCount} tasks completed` : "Create a task to start tracking progress."}</p>
                    </div>
                    <span className="text-lg font-semibold">{completion}%</span>
                </div>
                <div role="progressbar" aria-label="Completed tasks" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion} className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
                </div>
            </section>
        </div>
    );
}
