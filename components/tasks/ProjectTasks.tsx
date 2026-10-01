"use client";

import { useState } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import type { Task } from "@/types/task";

import {
    useGetProjectTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
} from "@/lib/services/tasksApi";
import TaskForm from "@/components/tasks/TaskForm";

type ProjectTasksProps = {
    projectId: string;
};

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
    const {
        currentData: tasks = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetProjectTasksQuery(projectId, {
        refetchOnMountOrArgChange: true,
    });

    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

    const [statusError, setStatusError] = useState("");
    const [updateTaskStatus, { isLoading: isUpdating }] =
        useUpdateTaskStatusMutation();

    const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState("");

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [updateTask, { isLoading: isSaving }] = useUpdateTaskMutation();

    const isBusy = isCreating || isUpdating || isDeleting || isSaving || isFetching;

    async function handleCreateTask(title: string, description: string) {
        if (isBusy) {
            throw new Error("Another operation is in progress.");
        }

        await createTask({
            projectId,
            title,
            description,
        }).unwrap();
    }

    async function handleStatusChange(id: string, status: Task["status"]) {
        if (isBusy) {
            return;
        }

        setStatusError("");

        try {
            await updateTaskStatus({ id, status }).unwrap();
        } catch {
            setStatusError("Could not update task status. Please try again.");
        }
    }

    async function handleDeleteTask(id: string) {
        if (isBusy) {
            return;
        }

        setDeleteError("");
        setDeletingId(id);

        try {
            await deleteTask(id).unwrap();
            if (editingTask?.id === id) {
                setEditingTask(null);
            }
        } catch {
            setDeleteError("Could not delete task. Please try again.");
        } finally {
            setDeletingId(null);
        }
    }

    async function handleUpdateTask(title: string, description: string) {
        if (!editingTask || isBusy) {
            throw new Error("Cannot update task right now.");
        }

        await updateTask({
            id: editingTask.id,
            title,
            description,
        }).unwrap();

        setEditingTask(null);
    }

    const router = useRouter();
    const pathname = usePathname();

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

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q") ?? "";
    const statusFilter = searchParams.get("status");

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === "todo" ||
            statusFilter === "in_progress" ||
            statusFilter === "done"
                ? task.status === statusFilter
                : true;

        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase());

        return matchesStatus && matchesSearch;
    });

    if (isLoading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return (
            <div className="mt-6 space-y-3">
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
        <section className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Tasks</h2>

            <div>
                <label htmlFor="task-filter" className="mb-2 block text-sm">
                    Filter by status
                </label>
                <select
                    id="task-filter"
                    value={
                        statusFilter === "todo" ||
                        statusFilter === "in_progress" ||
                        statusFilter === "done"
                            ? statusFilter
                            : "all"
                    }
                    onChange={(event) =>
                        handleFilterChange(event.target.value)
                    }
                    className="rounded-lg border bg-background p-2"
                >
                    <option value="all">All statuses</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <form
                className="flex max-w-xl gap-2"
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
                    className="min-w-0 flex-1 rounded-lg border p-2"
                />
                <button
                    type="submit"
                    className="rounded-lg border px-4 py-2"
                >
                    Search
                </button>
            </form>

            <TaskForm
                key={editingTask?.id ?? "create"}
                initialTask={editingTask}
                onSave={editingTask ? handleUpdateTask : handleCreateTask}
                disabled={isBusy}
                onCancel={() => setEditingTask(null)}
            />

            {statusError && (
                <p role="alert" className="text-red-400">
                    {statusError}
                </p>
            )}

            {deleteError && (
                <p role="alert" className="text-red-400">
                    {deleteError}
                </p>
            )}

            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : filteredTasks.length === 0 ? (
                <p>No tasks match this filter.</p>
            ) : (
                <ul className="space-y-3">
                    {filteredTasks.map((task) => (
                        <li key={task.id} className="rounded-lg border p-4">
                            <h3 className="font-semibold">{task.title}</h3>
                            <p>{task.description}</p>
                            <label
                                htmlFor={`task-status-${task.id}`}
                                className="mt-3 block text-sm"
                            >
                                Status
                            </label>
                            <select
                                id={`task-status-${task.id}`}
                                value={task.status}
                                disabled={isBusy}
                                onChange={(event) => {
                                    const status = event.target.value;

                                    if (
                                        status === "todo" ||
                                        status === "in_progress" ||
                                        status === "done"
                                    ) {
                                        void handleStatusChange(task.id, status);
                                    }
                                }}
                                className="mt-1 rounded-lg border bg-background p-2"
                            >
                                <option value="todo">Todo</option>
                                <option value="in_progress">In progress</option>
                                <option value="done">Done</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => setEditingTask(task)}
                                disabled={isBusy}
                                className="mt-3 block text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleDeleteTask(task.id)}
                                disabled={isBusy}
                                className="mt-3 block text-sm text-red-400 transition-colors hover:text-red-300 disabled:opacity-50"
                            >
                                {deletingId === task.id ? "Deleting..." : "Delete"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
