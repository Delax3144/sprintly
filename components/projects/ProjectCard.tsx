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
        <article className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">
                <Link
                    href={`/projects/${encodeURIComponent(id)}`}
                    className="transition-colors hover:text-blue-500"
                >
                    {title}
                </Link>
            </h2>
            <p className="mt-2 text-sm">{description}</p>
            <button
                type="button"
                onClick={onEdit}
                disabled={isDeleteDisabled}
                className="mr-4 mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
                Edit
            </button>
            <button
                type="button"
                onClick={onDelete}
                disabled={isDeleteDisabled}
                className="mt-4 text-sm text-red-400 transition-colors hover:text-red-300"
            >
                {isDeleting ? "Deleting…" : "Delete"}
            </button>
        </article>
    );
}
