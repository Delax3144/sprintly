"use client";

import { useId, useRef, useState, type FormEvent } from "react";

import type { Task } from "@/types/task";

type TaskFormProps = {
    onSave: (title: string, description: string) => Promise<void>;
    disabled: boolean;
    initialTask?: Task | null;
    onCancel?: () => void;
};

export default function TaskForm({
    onSave,
    disabled,
    initialTask = null,
    onCancel,
}: TaskFormProps) {
    const titleErrorId = useId();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const [titleError, setTitleError] = useState("");
    const [title, setTitle] = useState(initialTask?.title ?? "");
    const [description, setDescription] = useState(
        initialTask?.description ?? ""
    );
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isDisabled = disabled || isSubmitting;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isDisabled) {
            return;
        }

        const trimmedTitle = title.trim();
        setError("");

        if (!trimmedTitle) {
            setTitleError("Title is required.");
            titleInputRef.current?.focus();
            return;
        }

        setTitleError("");
        setIsSubmitting(true);

        try {
            await onSave(trimmedTitle, description.trim());
            setTitle("");
            setDescription("");
        } catch {
            setError("Could not save task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full min-w-0 max-w-xl space-y-4">
            <div>
                <label htmlFor="task-title" className="mb-2 block">
                    Task name
                </label>
                <input
                    id="task-title"
                    ref={titleInputRef}
                    aria-required="true"
                    aria-invalid={titleError !== ""}
                    aria-describedby={titleError ? titleErrorId : undefined}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isDisabled}
                    className="min-w-0 w-full rounded-lg border p-3"
                />
                {titleError && (
                    <p id={titleErrorId} role="alert" className="mt-2 text-danger">
                        {titleError}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="task-description" className="mb-2 block">
                    Description (optional)
                </label>
                <textarea
                    id="task-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={isDisabled}
                    rows={3}
                    className="min-w-0 w-full resize-y rounded-lg border p-3"
                />
            </div>

            {error && (
                <p role="alert" className="text-danger">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isDisabled}
                className="min-h-11 w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50 sm:w-auto"
            >
                {isSubmitting
                    ? "Saving..."
                    : initialTask
                        ? "Save changes"
                        : "Add task"}
            </button>
            {initialTask && onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isDisabled}
                    className="block min-h-11 w-full text-sm text-muted hover:text-foreground sm:w-auto"
                >
                    Cancel
                </button>
            )}
        </form>
    );
}
