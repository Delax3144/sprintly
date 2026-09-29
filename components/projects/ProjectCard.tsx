type ProjectCardProps = {
  title: string;
  description: string;
  onDelete: () => void;
};

export default function ProjectCard({title, description, onDelete}: ProjectCardProps) {
    return (
        <article className="rounded-lg border p-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm">{description}</p>
            <button
                type="button"
                onClick={onDelete}
                className="mt-4 text-sm text-red-400 transition-colors hover:text-red-300"
                >
                Delete
            </button>
        </article>
    );
}