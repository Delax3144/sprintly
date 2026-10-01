"use client";

import { useState, type FormEvent } from "react";

type ProjectFormProps = {
    onAdd: (title: string, description: string) => Promise<void>;
    disabled: boolean;
};

export default function ProjectForm({ onAdd, disabled }: ProjectFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
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
            return;
        }

        setTitleError("");
        setIsSubmitting(true);

        try {
            await onAdd(trimmedTitle, trimmedDescription);

            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Could not create project", error);
            setSubmitError("Could not create project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-4 flex max-w-md flex-col gap-4"
        >
            <label className="block">
                <span className="mb-2 block text-sm font-medium">
                Project name
                </span>

                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="w-full rounded-lg border px-3 py-2"
                    disabled={isDisabled}
                />
                {titleError !== "" && (
                    <p role="alert" className="mt-2 text-sm text-red-400">
                        {titleError}
                    </p>
                )}
            </label>

            <label className="block">
                <span className="mb-2 block text-sm font-medium">
                    Description (optional)
                </span>

                <textarea
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="w-full resize-y rounded-lg border px-3 py-2"
                    disabled={isDisabled}
                />
            </label>

            {submitError !== "" && (
                <p role="alert" className="text-sm text-red-400">
                    {submitError}
                </p>
            )}

            <button
                type="submit"
                disabled={isDisabled}
                className="self-start rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 disabled:cursor-wait disabled:opacity-50"
            >
                {isSubmitting ? "Saving…" : "Add project"}
            </button>
        </form>
    );
}