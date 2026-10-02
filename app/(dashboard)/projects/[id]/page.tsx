import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import ProjectDetails from "@/components/projects/ProjectDetails";

type ProjectPageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProjectPage({
    params,
}: ProjectPageProps) {
    const { id } = await params;

    return (
        <div className="space-y-6">
            <Link
                href="/projects"
                className="inline-flex items-center gap-1 rounded-sm text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
                <ChevronLeft aria-hidden="true" className="size-3.5" /> Projects
            </Link>

            <ProjectDetails id={id} />
        </div>
    );
}
