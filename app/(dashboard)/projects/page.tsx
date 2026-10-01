"use client";

import { useState } from "react";
import {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from "@/lib/services/projectsApi";

import ProjectCard from "@/components/projects/ProjectCard";
import ProjectForm from "@/components/projects/ProjectForm";

import type { Project } from "@/types/project";

export default function ProjectsPage() {
    const {
        data: projects = [],
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetProjectsQuery();
    const [createProject] = useCreateProjectMutation();
    const [updateProject] = useUpdateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const [deleteError, setDeleteError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const isBusy = isFetching || isSaving || deletingId !== null;

    const loadError = error
        ? "Could not load projects. Please try again."
        : "";

    async function handleAddProject(
        title: string,
        description: string
    ) {
        if (isBusy) {
            throw new Error("Another operation is in progress.");
        }

        setIsSaving(true);

        try {
            await createProject({ title, description }).unwrap();
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteProject(id: string) {
        if (isBusy) {
            return;
        }

        setDeletingId(id);
        setDeleteError("");

        try {
            await deleteProject(id).unwrap();

            if (editingProject?.id === id) {
                setEditingProject(null);
            }
        } catch (error) {
            console.error("Could not delete project:", error);
            setDeleteError("Could not delete project. Please try again.");
        } finally {
            setDeletingId(null);
        }
    }

    async function handleUpdateProject(
        title: string,
        description: string
    ) {
        if (editingProject === null || isBusy) {
            throw new Error("Cannot update project right now.");
        }

        setIsSaving(true);

        try {
            await updateProject({
                id: editingProject.id,
                title,
                description,
            }).unwrap();

            setEditingProject(null);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div>
            <h1>Projects</h1>

            {loadError !== "" && (
                <p role="alert" className="mt-2 text-sm text-danger">
                    {loadError}
                </p>
            )}

            <ProjectForm
                key={editingProject?.id ?? "create"}
                initialProject={editingProject}
                onSave={
                    editingProject === null
                        ? handleAddProject
                        : handleUpdateProject
                }
                disabled={isBusy || loadError !== ""}
                onCancel={() => setEditingProject(null)}
            />

            {deleteError !== "" && (
                <p role="alert" className="mt-4 text-sm text-danger">
                    {deleteError}
                </p>
            )}

            <div className="mt-4 grid gap-4">
                {isLoading ? (
                    <p>Loading projects…</p>
                ) : loadError !== "" ? (
                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isBusy}
                        className="justify-self-start rounded-lg border px-4 py-2 disabled:opacity-50"
                    >
                        {isFetching ? "Loading…" : "Retry"}
                    </button>
                ) : projects.length === 0 ? (
                    <p>No projects yet</p>
                ) : (
                    projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            id={project.id}
                            description={project.description}
                            onDelete={() => handleDeleteProject(project.id)}
                            isDeleting={deletingId === project.id}
                            isDeleteDisabled={isBusy}
                            onEdit={() => setEditingProject(project)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
