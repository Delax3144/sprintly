import Link from "next/link";

type ProjectCardProps = {
    title: string;
    description: string;
    id: string;
    onDelete: () => void;
    isDeleting: boolean;
    isDeleteDisabled: boolean;
    onEdit: () => void;
};

export default function ProjectCard({
    title,
    description,
    id,
    onDelete,
    isDeleting,
    isDeleteDisabled,
    onEdit,
}: ProjectCardProps) {
    return (
        <article className="min-w-0 rounded-xl border bg-surface p-5 shadow-sm">
            <h2 className="text-lg font-semibold wrap-anywhere">
                <Link
                    href={`/projects/${encodeURIComponent(id)}`}
                    className="transition-colors hover:text-accent"
                >
                    {title}
                </Link>
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm wrap-anywhere">{description}</p>
            <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit project: ${title}`}
                disabled={isDeleteDisabled}
                className="mr-4 mt-4 text-sm text-accent hover:text-accent-hover"
            >
                Edit
            </button>
            <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete project: ${title}`}
                disabled={isDeleteDisabled}
                className="mt-4 text-sm text-danger transition-colors hover:text-danger-hover"
            >
                {isDeleting ? "Deleting…" : "Delete"}
            </button>
        </article>
    );
}
