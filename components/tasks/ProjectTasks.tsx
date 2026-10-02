"use client";

import { useRef, useState } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader,
    DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/types/task";

import {
    useGetProjectTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation,
    useDeleteTaskMutation,
    useUpdateTaskMutation,
} from "@/lib/services/tasksApi";
import TaskForm from "@/components/tasks/TaskForm";
import KanbanBoard from "@/components/tasks/KanbanBoard";

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
    const [moveMessage, setMoveMessage] = useState("");
    const statusRequestPending = useRef(false);
    const [updateTaskStatus, { isLoading: isUpdating }] =
        useUpdateTaskStatusMutation();

    const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState("");

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
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
        setIsFormOpen(false);
    }

    async function handleStatusChange(id: string, status: Task["status"]) {
        if (isBusy || statusRequestPending.current) {
            return;
        }

        statusRequestPending.current = true;
        setStatusError("");
        setMoveMessage("");

        try {
            await updateTaskStatus({ id, status }).unwrap();
            const label = status === "todo" ? "Todo" : status === "done" ? "Done" : "In progress";
            setMoveMessage(`Task moved to ${label}.`);
        } catch {
            setStatusError("Could not move task. Please try again.");
        } finally {
            statusRequestPending.current = false;
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
        setIsFormOpen(false);
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

    if (error && !isFormOpen) {
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
        <section className="mt-8 space-y-5">
            <Dialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    if (isCreating || isSaving) return;
                    setIsFormOpen(open);
                    if (!open) setEditingTask(null);
                }}
            >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-base font-semibold">Board</h2>
                        <Badge variant="secondary" className="rounded-md px-2 font-normal">
                            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
                        </Badge>
                    </div>
                    <DialogTrigger asChild>
                        <Button disabled={isBusy} onClick={() => setEditingTask(null)}>
                            <Plus aria-hidden="true" /> New task
                        </Button>
                    </DialogTrigger>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <form
                        className="flex w-full gap-2 sm:max-w-sm"
                        onSubmit={(event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const query = String(formData.get("q") ?? "").trim();
                            const params = new URLSearchParams(searchParams.toString());
                            if (query) params.set("q", query);
                            else params.delete("q");
                            const queryString = params.toString();
                            router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
                        }}
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search aria-hidden="true" className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
                            <Input
                                key={searchQuery}
                                type="search"
                                name="q"
                                aria-label="Search tasks by title"
                                defaultValue={searchQuery}
                                placeholder="Search tasks..."
                                className="bg-card pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline" size="icon" aria-label="Search tasks">
                            <Search aria-hidden="true" />
                        </Button>
                    </form>
                    <Select
                        value={statusFilter === "todo" || statusFilter === "in_progress" || statusFilter === "done" ? statusFilter : "all"}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className="w-full bg-card sm:w-44" aria-label="Filter by status">
                            <SlidersHorizontal aria-hidden="true" className="size-3.5 text-muted-foreground" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="todo">Todo</SelectItem>
                            <SelectItem value="in_progress">In progress</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground sm:ml-auto">
                        {filteredTasks.length} of {tasks.length} tasks
                    </p>
                </div>

                <DialogContent
                    className="max-h-[85dvh] overflow-y-auto bg-card sm:max-w-lg"
                    showCloseButton={!isCreating && !isSaving}
                    onEscapeKeyDown={(event) => {
                        if (isCreating || isSaving) event.preventDefault();
                    }}
                    onPointerDownOutside={(event) => {
                        if (isCreating || isSaving) event.preventDefault();
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>{editingTask ? "Edit task" : "New task"}</DialogTitle>
                        <DialogDescription>
                            {editingTask ? "Update the task name and description." : "Add a task to this project. It will start in Todo."}
                        </DialogDescription>
                    </DialogHeader>
                    <TaskForm
                        key={editingTask?.id ?? "create"}
                        initialTask={editingTask}
                        onSave={editingTask ? handleUpdateTask : handleCreateTask}
                        disabled={isBusy}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingTask(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {(statusError || deleteError) && (
                <p role="alert" className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                    {statusError || deleteError}
                </p>
            )}
            <p role="status" className="sr-only">{moveMessage}</p>
            {tasks.length > 0 && filteredTasks.length === 0 && (
                <p className="text-sm text-muted-foreground">No tasks match this filter.</p>
            )}
            <KanbanBoard
                tasks={filteredTasks}
                disabled={isBusy}
                deletingId={deletingId}
                onStatusChange={handleStatusChange}
                onEdit={(task) => {
                    setEditingTask(task);
                    setIsFormOpen(true);
                }}
                onDelete={handleDeleteTask}
            />
        </section>
    );
}
