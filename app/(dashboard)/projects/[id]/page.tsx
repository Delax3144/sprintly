import Link from "next/link";

import ProjectDetails from "@/components/projects/ProjectDetails";

type ProjectPageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProjectPage({
    params,
}: ProjectPageProps) {
    const { id } = await params;

    return (
        <div className="space-y-4">
            <Link
                href="/projects"
                className="inline-block text-accent transition-colors hover:text-accent-hover"
            >
                ← Back to projects
            </Link>

            <ProjectDetails id={id} />
        </div>
    );
}
