"use client";

import { useGetProjectQuery } from "@/lib/services/projectsApi";

import ProjectTasks from "@/components/tasks/ProjectTasks";

type ProjectDetailsProps = {
    id: string;
};

export default function ProjectDetails({ id }: ProjectDetailsProps) {
    const {
        currentData: project,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetProjectQuery(id, {
        refetchOnMountOrArgChange: true,
    });

    if (isLoading) {
        return <p>Loading project...</p>;
    }

    if (error) {
        if ("status" in error && error.status === 404) {
            return <p>Project not found.</p>;
        }

        return (
            <div className="space-y-3">
                <p role="alert">Could not load project.</p>
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

    if (!project) {
        if (isFetching) {
            return <p>Loading project...</p>;
        }

        return <p>Project not found.</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold wrap-anywhere">
                {project.title}
            </h1>
            <p className="mt-2 whitespace-pre-wrap wrap-anywhere">
                {project.description}
            </p>
            <ProjectTasks key={project.id} projectId={project.id} />
        </div>
    );
}
