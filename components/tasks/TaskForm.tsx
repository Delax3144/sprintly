"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-5">
            <div className="space-y-2">
                <Label htmlFor="task-title">
                    Task name
                </Label>
                <Input
                    id="task-title"
                    ref={titleInputRef}
                    aria-required="true"
                    aria-invalid={titleError !== ""}
                    aria-describedby={titleError ? titleErrorId : undefined}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    disabled={isDisabled}
                    placeholder="What needs to be done?"
                />
                {titleError && (
                    <p id={titleErrorId} role="alert" className="mt-2 text-danger">
                        {titleError}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="task-description">
                    Description <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                    id="task-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    disabled={isDisabled}
                    rows={4}
                    placeholder="Add details or context..."
                    className="min-h-28 resize-y"
                />
            </div>

            {error && (
                <p role="alert" className="text-danger">
                    {error}
                </p>
            )}

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isDisabled}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isDisabled}>
                    {isSubmitting && <Loader2 aria-hidden="true" className="animate-spin" />}
                    {isSubmitting ? "Saving..." : initialTask ? "Save changes" : "Create task"}
                </Button>
            </div>
        </form>
    );
}
