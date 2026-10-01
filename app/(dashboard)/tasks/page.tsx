"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useGetTasksQuery } from "@/lib/services/tasksApi";

const statusLabels = {
    todo: "Todo",
    in_progress: "In progress",
    done: "Done",
};

function TasksContent() {
    const {
        data: tasks = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetTasksQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const searchQuery = searchParams.get("q") ?? "";
    const status = searchParams.get("status");
    const statusFilter =
        status === "todo" ||
        status === "in_progress" ||
        status === "done"
            ? status
            : "all";

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === "all" || task.status === statusFilter;

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase());

        return matchesStatus && matchesSearch;
    });

    function handleFilterChange(status: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (status === "all") {
            params.delete("status");
        } else {
            params.set("status", status);
        }

        const query = params.toString();

        router.replace(
            query ? `${pathname}?${query}` : pathname,
            { scroll: false }
        );
    }

    if (isLoading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return (
            <div className="space-y-3">
                <p role="alert">Could not load tasks.</p>

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

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">My Tasks</h1>

            <div>
                <label htmlFor="status-filter" className="mb-2 block text-sm">
                    Filter by status
                </label>
                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                        handleFilterChange(event.target.value)
                    }
                    className="min-h-11 w-full rounded-lg border bg-background p-2 sm:w-auto"
                >
                    <option value="all">All statuses</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <form
                className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                    event.preventDefault();

                    const formData = new FormData(event.currentTarget);
                    const query = String(formData.get("q") ?? "").trim();
                    const params = new URLSearchParams(searchParams.toString());

                    if (query) {
                        params.set("q", query);
                    } else {
                        params.delete("q");
                    }

                    const queryString = params.toString();

                    router.replace(
                        queryString ? `${pathname}?${queryString}` : pathname,
                        { scroll: false }
                    );
                }}
            >
                <input
                    key={searchQuery}
                    type="search"
                    name="q"
                    aria-label="Search tasks by title"
                    defaultValue={searchQuery}
                    placeholder="Search tasks..."
                    className="min-h-11 min-w-0 w-full rounded-lg border p-2 sm:flex-1"
                />
                <button
                    type="submit"
                    className="min-h-11 shrink-0 rounded-lg border px-4 py-2"
                >
                    Search
                </button>
            </form>

            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : filteredTasks.length === 0 ? (
                <p>No tasks match this filter.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredTasks.map((task) => (
                        <li key={task.id} className="min-w-0 rounded-xl border bg-surface p-5 shadow-sm">
                            <h2 className="font-semibold wrap-anywhere">{task.title}</h2>
                            <p className="mt-2 whitespace-pre-wrap wrap-anywhere">{task.description}</p>

                            <Link
                                href={`/projects/${encodeURIComponent(task.projectId)}`}
                                className="mt-3 inline-block text-sm text-accent hover:text-accent-hover wrap-anywhere"
                            >
                                {task.projectTitle}
                            </Link>

                            <p className="mt-2 text-sm">
                                {statusLabels[task.status]}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function TasksPage() {
    return (
        <Suspense fallback={<p>Loading tasks...</p>}>
            <TasksContent />
        </Suspense>
    );
}