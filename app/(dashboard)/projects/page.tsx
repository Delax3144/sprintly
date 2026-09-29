"use client";

import { useState, type FormEvent } from "react";
import ProjectCard from "@/components/projects/ProjectCard";

const initialProjects = [
  {
    id: "1",
    title: "Website redesign",
    description: "Update the company website.",
  },
  {
    id: "2",
    title: "Sprintly",
    description: "Manage projects and tasks.",
  },
  {
    id: "3",
    title: "Website feature",
    description: "Add new features"
  }
];

export default function ProjectsPage() {
    const [projects, setProjects] = useState(initialProjects);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [titleError, setTitleError] = useState("");

    function handleAddProject(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (trimmedTitle === "") {
            setTitleError("Enter a project name.");
            return;
        }

        setTitleError("");

        const newProject = {
            id: crypto.randomUUID(),
            title: trimmedTitle,
            description: trimmedDescription,
        };

        setProjects((currentProjects) => [
            ...currentProjects,
            newProject,
        ]);
        setTitle("");
        setDescription("");
    }

    function handleDeleteProject(id: string) {
        setProjects((currentProjects) =>
            currentProjects.filter((project) => project.id !== id)
        );
    }

    return (
        <div>
            <h1>Projects</h1>

            <form
                onSubmit={handleAddProject}
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
                    />
                </label>

                <button
                    type="submit"
                    className="self-start rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                >
                    Add project
                </button>
            </form>

            <div className="mt-4 grid gap-4">
            {projects.length === 0
            ?   <p>No projects yet</p>
            :   projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        title={project.title}
                        description={project.description}
                        onDelete={() => handleDeleteProject(project.id)}
                    />
                ))}
            </div>
        </div>
    );
}
