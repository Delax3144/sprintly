"use client";

import { useGetProjectQuery } from "@/lib/services/projectsApi";

type ProjectDetailsProps = {
    id: string;
};

export default function ProjectDetails({ id }: ProjectDetailsProps) {
    const { data: project, isLoading, error } = useGetProjectQuery(id);

    if (isLoading) {
        return <p>Loading project...</p>;
    }

    if (error) {
        if ("status" in error && error.status === 404) {
            return <p>Project not found.</p>;
        }

        return <p>Could not load project.</p>;
    }

    if (!project) {
        return <p>Project not found.</p>;
    }

    return (
        <div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
        </div>
    );
}