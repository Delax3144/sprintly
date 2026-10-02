"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import type { Project } from "@/types/project";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProjectFormProps = {
    onSave: (title: string, description: string) => Promise<void>;
    disabled: boolean;
    initialProject: Project | null;
    onCancel: () => void;
};

export default function ProjectForm({
    onSave,
    disabled,
    initialProject,
    onCancel,
}: ProjectFormProps) {
    const titleErrorId = useId();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const [title, setTitle] = useState(initialProject?.title ?? "");
    const [description, setDescription] = useState(initialProject?.description ?? "");
    const [titleError, setTitleError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const isDisabled = disabled || isSubmitting;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isDisabled) {
            return;
        }

        setSubmitError("");

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (trimmedTitle === "") {
            setTitleError("Enter a project name.");
            titleInputRef.current?.focus();
            return;
        }

        setTitleError("");
        setIsSubmitting(true);

        try {
            await onSave(trimmedTitle, trimmedDescription);

            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Could not save project", error);
            setSubmitError("Could not save project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full min-w-0 flex-col gap-5"
        >
            <label className="block">
                <span className="mb-2 block text-sm font-medium">
                    Project name
                </span>

                <Input
                    type="text"
                    ref={titleInputRef}
                    aria-required="true"
                    aria-invalid={titleError !== ""}
                    aria-describedby={titleError ? titleErrorId : undefined}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Website refresh"
                    disabled={isDisabled}
                />
                {titleError !== "" && (
                    <p id={titleErrorId} role="alert" className="mt-2 text-sm text-danger">
                        {titleError}
                    </p>
                )}
            </label>

            <label className="block">
                <span className="mb-2 block text-sm font-medium">
                    Description (optional)
                </span>

                <Textarea
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="min-h-28 resize-y"
                    placeholder="What is this project about?"
                    disabled={isDisabled}
                />
            </label>

            {submitError !== "" && (
                <p role="alert" className="text-sm text-danger">
                    {submitError}
                </p>
            )}

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isDisabled}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isDisabled}
                >
                    {isSubmitting && <Loader2 aria-hidden="true" className="animate-spin" />}
                    {isSubmitting
                        ? "Saving…"
                        : initialProject !== null
                            ? "Save changes"
                            : "Create project"}
                </Button>
            </div>
        </form>
    );
}
