"use client";

import { useState, useEffect } from "react";

import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";

import type { Project } from "@/types/project";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loadAttempt, setLoadAttempt] = useState(0);

    const isBusy = isLoading || isCreating || deletingId !== null;

    useEffect(() => {
        let ignore = false;

        async function loadProjects() {
            try {
                const response = await fetch("/api/projects");

                if (!response.ok) {
                    throw new Error("Failed to load projects.");
                }

                const loadedProjects: Project[] = await response.json();

                if (!ignore) {
                    setProjects(loadedProjects);
                }
            } catch (error) {
                if (!ignore) {
                    console.error("Could not load projects:", error);
                    setLoadError("Could not load projects. Please try again.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadProjects();

        return () => {
            ignore = true;
        };
    }, [loadAttempt]);

    async function handleAddProject(
            title: string,
            description: string
        ) {
            if(isBusy) {
                throw new Error("Another operation is in progress.")
            }

            setIsCreating(true);

            try {
                const response = await fetch("/api/projects", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title, description }),
                });

                if (!response.ok) {
                    throw new Error("Could not create project. Please try again.");
                }

                const createdProject: Project = await response.json();

                setProjects((currentProjects) => [
                    ...currentProjects,
                    createdProject,
                ]);
            } finally {
                setIsCreating(false);
            }
    }

    async function handleDeleteProject(id: string) {
        if (isBusy) {
            return;
        }

        setDeletingId(id);
        setDeleteError("");

        try {
            const response = await fetch(
                `/api/projects/${encodeURIComponent(id)}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Could not delete project.");
            }

            setProjects((currentProjects) =>
                currentProjects.filter((project) => project.id !== id)
            );
        } catch (error) {
            console.error("Could not delete project:", error);
            setDeleteError("Could not delete project. Please try again.");
        } finally {
            setDeletingId(null);
        }
    }

    function handleRetryLoad() {
        if (isBusy) {
            return;
        }

        setLoadError("");
        setIsLoading(true);
        setLoadAttempt((currentAttempt) => currentAttempt + 1);
    }

    return (
        <div>
            <h1>Projects</h1>

            {loadError !== "" && (
                <p role="alert" className="mt-2 text-sm text-red-400">
                    {loadError}
                </p>
            )}

            <ProjectForm
                onAdd={handleAddProject}
                disabled={isBusy || loadError !== ""}
            />

            {deleteError !== "" && (
                <p role="alert" className="mt-4 text-sm text-red-400">
                    {deleteError}
                </p>
            )}

            <div className="mt-4 grid gap-4">
                {isLoading ? (
                    <p>Loading projects…</p>
                ) : loadError !== "" ? (
                    <button
                        type="button"
                        onClick={handleRetryLoad}
                        disabled={isBusy}
                        className="justify-self-start rounded-lg border px-4 py-2 disabled:opacity-50"
                    >
                        Retry
                    </button>
                ) : projects.length === 0 ? (
                    <p>No projects yet</p>
                ) : (
                projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        onDelete={() => handleDeleteProject(project.id)}
                        isDeleting={deletingId === project.id}
                        isDeleteDisabled={isBusy}
                    />
                ))
                )}
            </div>
        </div>
    );
}
