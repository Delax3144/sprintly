"use client";

import { useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    const [isFormOpen, setIsFormOpen] = useState(false);
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
            setIsFormOpen(false);
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
            setIsFormOpen(false);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
                        <Badge variant="secondary">{projects.length}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Your projects and their task boards.</p>
                </div>
                <Button disabled={isBusy || !!loadError} onClick={() => { setEditingProject(null); setIsFormOpen(true); }}>
                    <Plus aria-hidden="true" /> New project
                </Button>
            </div>
            <Dialog open={isFormOpen} onOpenChange={(open) => {
                if (isSaving) return;
                setIsFormOpen(open);
                if (!open) setEditingProject(null);
            }}>
                <DialogContent className="max-h-[85dvh] overflow-y-auto bg-card sm:max-w-lg" showCloseButton={!isSaving}
                    onEscapeKeyDown={(event) => { if (isSaving) event.preventDefault(); }}
                    onPointerDownOutside={(event) => { if (isSaving) event.preventDefault(); }}>
                    <DialogHeader>
                        <DialogTitle>{editingProject ? "Edit project" : "New project"}</DialogTitle>
                        <DialogDescription>{editingProject ? "Update the project name and description." : "Create a space for your tasks."}</DialogDescription>
                    </DialogHeader>
                    <ProjectForm key={editingProject?.id ?? "create"} initialProject={editingProject}
                        onSave={editingProject ? handleUpdateProject : handleAddProject}
                        disabled={isBusy || !!loadError}
                        onCancel={() => { setIsFormOpen(false); setEditingProject(null); }} />
                </DialogContent>
            </Dialog>
            {(loadError || deleteError) && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{loadError || deleteError}</p>}
            {isLoading ? <p className="text-sm text-muted-foreground">Loading projects…</p> : loadError ? (
                <Button variant="outline" onClick={() => void refetch()} disabled={isBusy}>Retry</Button>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center rounded-lg border border-dashed py-16 text-center">
                    <FolderKanban aria-hidden="true" className="mb-4 size-8 text-muted-foreground" />
                    <h2 className="font-medium">Create your first project</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Add a project, then break it down into tasks.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} title={project.title} id={project.id} description={project.description}
                            onDelete={() => void handleDeleteProject(project.id)} isDeleting={deletingId === project.id}
                            isDeleteDisabled={isBusy} onEdit={() => { setEditingProject(project); setIsFormOpen(true); }} />
                    ))}
                </div>
            )}
        </div>
    );
}