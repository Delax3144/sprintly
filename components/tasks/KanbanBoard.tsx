"use client";

import { useState } from "react";
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/task";

const columns: { status: Task["status"]; title: string; color: string; badge: string }[] = [
    { status: "todo", title: "Todo", color: "bg-slate-400", badge: "bg-secondary text-secondary-foreground" },
    { status: "in_progress", title: "In progress", color: "bg-violet-500", badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300" },
    { status: "done", title: "Done", color: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
];

type KanbanBoardProps = {
    tasks: Task[];
    disabled: boolean;
    deletingId: string | null;
    onStatusChange: (id: string, status: Task["status"]) => Promise<void>;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => Promise<void>;
};

export default function KanbanBoard({
    tasks, disabled, deletingId, onStatusChange, onEdit, onDelete,
}: KanbanBoardProps) {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [hoveredStatus, setHoveredStatus] = useState<Task["status"] | null>(null);

    return (
        <div role="region" aria-label="Task board" tabIndex={0} className="relative overflow-x-auto rounded-lg pb-3">
            <div className="grid min-w-[780px] grid-cols-3 gap-5">
                {columns.map((column) => {
                    const columnTasks = tasks.filter((task) => task.status === column.status);
                    const highlighted = draggingId !== null && hoveredStatus === column.status;

                    return (
                        <section
                            key={column.status}
                            aria-labelledby={`column-${column.status}`}
                            onDragOver={(event) => {
                                if (!disabled && draggingId) {
                                    event.preventDefault();
                                    event.dataTransfer.dropEffect = "move";
                                    setHoveredStatus(column.status);
                                }
                            }}
                            onDragLeave={(event) => {
                                const target = event.relatedTarget;
                                if (!(target instanceof Node) || !event.currentTarget.contains(target)) {
                                    setHoveredStatus(null);
                                }
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                const id = event.dataTransfer.getData("text/plain");
                                const task = tasks.find((item) => item.id === id);
                                setDraggingId(null);
                                setHoveredStatus(null);
                                if (!disabled && task && id === draggingId && task.status !== column.status) {
                                    void onStatusChange(id, column.status);
                                }
                            }}
                            className={`min-h-80 rounded-lg border p-3 transition-colors ${
                                highlighted ? "border-primary bg-primary/5" : "border-transparent bg-muted/50"
                            }`}
                        >
                            <div className="mb-3 flex items-center gap-2 px-1 py-1.5">
                                <span aria-hidden="true" className={`size-2 rounded-full ${column.color}`} />
                                <h3 id={`column-${column.status}`} className="text-sm font-medium">{column.title}</h3>
                                <span className="ml-1 text-xs tabular-nums text-muted-foreground">{columnTasks.length}</span>
                            </div>

                            <ul className="space-y-2.5">
                                {columnTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className={`group rounded-lg border bg-card p-3.5 shadow-xs transition-shadow hover:shadow-sm ${draggingId === task.id ? "opacity-40" : ""}`}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <Badge variant="outline" className={`border-0 px-1.5 py-0.5 text-[11px] font-medium ${column.badge}`}>
                                                {column.title}
                                            </Badge>
                                            <div className="flex items-center gap-0.5">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-xs"
                                                    draggable={!disabled}
                                                    disabled={disabled}
                                                    aria-label={`Drag task: ${task.title}. Use the task menu to change status with a keyboard.`}
                                                    title="Drag to another column"
                                                    onDragStart={(event) => {
                                                        event.dataTransfer.setData("text/plain", task.id);
                                                        event.dataTransfer.effectAllowed = "move";
                                                        setDraggingId(task.id);
                                                    }}
                                                    onDragEnd={() => {
                                                        setDraggingId(null);
                                                        setHoveredStatus(null);
                                                    }}
                                                    className="cursor-grab text-muted-foreground active:cursor-grabbing"
                                                >
                                                    <GripVertical aria-hidden="true" />
                                                </Button>
                                                <DropdownMenu modal={false}>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button type="button" variant="ghost" size="icon-xs" disabled={disabled} aria-label={`Actions for task: ${task.title}`} className="text-muted-foreground">
                                                            <MoreHorizontal aria-hidden="true" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onSelect={() => onEdit(task)}>
                                                            <Pencil aria-hidden="true" /> Edit task
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuLabel>Move to</DropdownMenuLabel>
                                                        <DropdownMenuRadioGroup
                                                            value={task.status}
                                                            onValueChange={(status) => {
                                                                if (status === "todo" || status === "in_progress" || status === "done") {
                                                                    void onStatusChange(task.id, status);
                                                                }
                                                            }}
                                                        >
                                                            {columns.map((option) => (
                                                                <DropdownMenuRadioItem key={option.status} value={option.status} disabled={disabled}>
                                                                    {option.title}
                                                                </DropdownMenuRadioItem>
                                                            ))}
                                                        </DropdownMenuRadioGroup>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem variant="destructive" disabled={disabled} onSelect={() => void onDelete(task.id)}>
                                                            <Trash2 aria-hidden="true" /> Delete task
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        <h4 className="text-sm leading-5 font-medium wrap-anywhere">{task.title}</h4>
                                        {task.description && (
                                            <p className="mt-1.5 line-clamp-3 whitespace-pre-wrap text-xs leading-5 text-muted-foreground wrap-anywhere">
                                                {task.description}
                                            </p>
                                        )}
                                        {deletingId === task.id && <p role="status" className="mt-2 text-xs text-muted-foreground">Deleting...</p>}
                                    </li>
                                ))}
                            </ul>
                            {columnTasks.length === 0 && (
                                <div className="rounded-md border border-dashed p-6 text-center text-xs text-muted-foreground">
                                    No tasks here
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
