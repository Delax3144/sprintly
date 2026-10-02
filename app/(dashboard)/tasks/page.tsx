"use client";

import Link from "next/link";
import { FolderKanban, Search, ListTodo, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

                <Button
                    type="button"
                    onClick={() => void refetch()}
                    disabled={isFetching}
                    variant="outline"
                >
                    {isFetching ? "Loading..." : "Retry"}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
                    <Badge variant="secondary">{tasks.length}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Tasks across all your projects.</p>
            </div>
            <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center">

            <form
                className="flex w-full gap-2 sm:max-w-sm"
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
                <Input
                    key={searchQuery}
                    type="search"
                    name="q"
                    aria-label="Search tasks by title"
                    defaultValue={searchQuery}
                    placeholder="Search tasks..."
                    className="min-w-0 flex-1"
                />
                <Button
                    type="submit"
                    variant="outline" size="icon" aria-label="Search tasks"
                >
                    <Search aria-hidden="true" />
                </Button>
            </form>
                <Select value={statusFilter} onValueChange={handleFilterChange}>
                    <SelectTrigger aria-label="Filter by status" className="w-full sm:w-44">
                        <SlidersHorizontal aria-hidden="true" className="size-4" /><SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="todo">Todo</SelectItem>
                        <SelectItem value="in_progress">In progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground sm:ml-auto">{filteredTasks.length} of {tasks.length} tasks</p>
            </div>

            {tasks.length === 0 ? (
                <div className="rounded-lg border border-dashed py-16 text-center"><ListTodo aria-hidden="true" className="mx-auto mb-4 size-8 text-muted-foreground" /><h2 className="font-medium">No tasks yet</h2><p className="mt-2 text-sm text-muted-foreground">Open a project board to create your first task.</p></div>
            ) : filteredTasks.length === 0 ? (
                <p>No tasks match this filter.</p>
            ) : (
                <ul className="divide-y rounded-lg border bg-card">
                    {filteredTasks.map((task) => (
                        <li key={task.id} className="min-w-0 p-4 sm:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-medium wrap-anywhere">{task.title}</h2><Badge variant="secondary" className={task.status === "done" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : task.status === "in_progress" ? "bg-violet-500/10 text-violet-700 dark:text-violet-300" : ""}>{statusLabels[task.status]}</Badge></div>
                            {task.description && <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground wrap-anywhere">{task.description}</p>}

                            <Link
                                href={`/projects/${encodeURIComponent(task.projectId)}`}
                                className="mt-3 inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground hover:text-primary wrap-anywhere"
                            >
                                <FolderKanban aria-hidden="true" className="size-3.5 shrink-0" />{task.projectTitle}
                            </Link>
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